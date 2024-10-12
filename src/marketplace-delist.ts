import { CONTRACT_ADDRESSES } from "./constants";
import { config } from "./config";
import {
  getSigner,
  getContractInstances,
  approveBatchTransferIfNeeded,
} from "./utils";

export async function delistAxies(): Promise<void> {
  const signer = getSigner();
  const address = await signer.getAddress();
  console.log(
    "🛠️ Delisting (max 100 at once): May take a few minutes to see the changes on the marketplace",
  );
  const query = `query GetListings {
    axies(from: 0, sort: LevelDesc, owner: "${address}", size: 100, auctionType: Sale) {
      results { id }
    }
  }`;

  const response = await fetch(config.graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${config.accessToken}`,
      ...(config.skymavisApiKey ? { "x-api-key": config.skymavisApiKey } : {}),
    },
    body: JSON.stringify({ query }),
  });

  const responseData = (await response.json()) as any;
  const axieIds =
    responseData.data?.axies?.results?.map((axie: { id: string }) => axie.id) ||
    [];
  if (axieIds.length === 0) {
    console.log("❌ No active listings found");
    return;
  }

  const { axie: axieContract, batchTransfer: batchTransferContract } =
    getContractInstances(signer);

  await approveBatchTransferIfNeeded(
    axieContract,
    address,
    batchTransferContract.target as string,
  );

  const batchTransferTx = await batchTransferContract.safeBatchTransfer(
    CONTRACT_ADDRESSES.AXIE,
    axieIds,
    address,
  );
  await batchTransferTx.wait();
  console.log(
    `✅ ${axieIds.length} Axies successfully delisted. Now wait for the marketplace to update...`,
  );
}
