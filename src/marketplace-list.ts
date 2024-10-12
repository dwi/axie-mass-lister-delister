import { ethers } from "ethers";
import * as fs from "fs";
import * as csv from "csv-parse/sync";
import { CONTRACT_ADDRESSES, ORDER_EXPIRATION } from "./constants";
import { config } from "./config";
import {
  getSigner,
  getContractInstances,
  approveMarketplaceIfNeeded,
  getProvider,
} from "./utils";

interface ICreateOrderData {
  address: string;
  axieId: string;
  basePrice: string;
  endedPrice: string;
  startedAt: number;
  endedAt: number;
  expiredAt: number;
}

async function createMarketplaceOrder(
  orderData: ICreateOrderData,
  accessToken: string,
  signer: ethers.Wallet,
  skyMavisApiKey?: string,
): Promise<any> {
  const {
    address,
    axieId,
    basePrice,
    endedPrice,
    startedAt,
    endedAt,
    expiredAt,
  } = orderData;

  const types = {
    Asset: [
      { name: "erc", type: "uint8" },
      { name: "addr", type: "address" },
      { name: "id", type: "uint256" },
      { name: "quantity", type: "uint256" },
    ],
    Order: [
      { name: "maker", type: "address" },
      { name: "kind", type: "uint8" },
      { name: "assets", type: "Asset[]" },
      { name: "expiredAt", type: "uint256" },
      { name: "paymentToken", type: "address" },
      { name: "startedAt", type: "uint256" },
      { name: "basePrice", type: "uint256" },
      { name: "endedAt", type: "uint256" },
      { name: "endedPrice", type: "uint256" },
      { name: "expectedState", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "marketFeePercentage", type: "uint256" },
    ],
  };

  const domain = {
    name: "MarketGateway",
    version: "1",
    chainId: "2020",
    verifyingContract: CONTRACT_ADDRESSES.MARKETPLACE_V2,
  };

  const order = {
    maker: address,
    kind: "1",
    assets: [
      {
        erc: "1",
        addr: CONTRACT_ADDRESSES.AXIE,
        id: axieId,
        quantity: "0",
      },
    ],
    expiredAt,
    paymentToken: CONTRACT_ADDRESSES.WETH,
    startedAt,
    basePrice,
    endedAt,
    endedPrice,
    expectedState: "0",
    nonce: "0",
    marketFeePercentage: "425",
  };

  const signature = await signer.signTypedData(domain, types, order);

  const query = `
    mutation CreateOrder($order: InputOrder!, $signature: String!) {
      createOrder(order: $order, signature: $signature) {
        ...OrderInfo
        __typename
      }
    }
    fragment OrderInfo on Order {
      id
      maker
      kind
      assets {
        ...AssetInfo
        __typename
      }
      expiredAt
      paymentToken
      startedAt
      basePrice
      endedAt
      endedPrice
      expectedState
      nonce
      marketFeePercentage
      signature
      hash
      duration
      timeLeft
      currentPrice
      suggestedPrice
      currentPriceUsd
      __typename
    }
    fragment AssetInfo on Asset {
      erc
      address
      id
      quantity
      orderId
      __typename
    }
  `;
  const variables = {
    order: {
      nonce: 0,
      assets: [
        {
          id: axieId,
          address: CONTRACT_ADDRESSES.AXIE,
          erc: "Erc721",
          quantity: "0",
        },
      ],
      basePrice,
      endedPrice,
      startedAt,
      endedAt,
      expiredAt,
    },
    signature,
  };

  const headers: Record<string, string> = {
    authorization: `Bearer ${accessToken}`,
  };

  if (skyMavisApiKey) {
    headers["x-api-key"] = skyMavisApiKey;
  }

  const response = await fetch(config.graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
  });

  return await response.json();
}

export async function listAxies(csvFilePath: string): Promise<void> {
  const signer = getSigner();
  const address = await signer.getAddress();
  const currentBlock = await getProvider().getBlock("latest");
  const startedAt = currentBlock!.timestamp;

  const { axie: axieContract } = getContractInstances(signer);
  await approveMarketplaceIfNeeded(axieContract, address);

  const fileContent = fs.readFileSync(csvFilePath, "utf8");
  const records = csv.parse(fileContent, { delimiter: ";" });

  console.log(`🛠️ Listing ${records.length} Axies...`);
  for (const [axieId, listingPrice] of records) {
    if (!/^\d+$/.test(axieId) || !/^\d+(\.\d+)?$/.test(listingPrice)) {
      console.error(
        `❌ Invalid csv format for entry: ${axieId};${listingPrice}. Skipping.`,
      );
      continue;
    }

    const axieIdNumber = parseInt(axieId, 10);
    const listingPriceWei = ethers.parseEther(listingPrice);

    try {
      const owner = await axieContract.ownerOf(axieIdNumber);
      if (owner.toLowerCase() !== address.toLowerCase()) {
        console.error(
          `❌ Axie ${axieId} is not owned by ${address}. Skipping.`,
        );
        continue;
      }

      const orderData: ICreateOrderData = {
        address,
        axieId: axieIdNumber.toString(),
        basePrice: listingPriceWei.toString(),
        endedPrice: "0",
        startedAt,
        endedAt: 0,
        expiredAt: startedAt + ORDER_EXPIRATION,
      };

      const result = await createMarketplaceOrder(
        orderData,
        config.accessToken,
        signer,
        config.skymavisApiKey,
      );

      if (
        result === null ||
        result.data?.createOrder.hash === undefined ||
        result.errors !== undefined
      ) {
        console.error(
          `❌ Cannot list Axie ${axieId}:`,
          result?.errors?.[0]?.message,
        );
      } else {
        console.log(
          `✅ Successfully listed Axie ${axieId} for ${listingPrice} ETH`,
        );
      }
    } catch (err) {
      console.error(`❌ Error listing Axie ${axieId}:`, err);
    }
  }
}
