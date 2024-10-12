import { ethers } from "ethers";
import * as fs from "fs";
import { CONTRACT_ADDRESSES, ABI_FILES } from "./constants";
import { config } from "./config";

interface IContractInstance {
  axie: ethers.Contract;
  batchTransfer: ethers.Contract;
}

export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(config.rpcUrl);
}

export function getSigner(): ethers.Wallet {
  const provider = getProvider();
  return new ethers.Wallet(config.privateKey, provider);
}

export function getContractInstances(signer: ethers.Wallet): IContractInstance {
  return {
    axie: new ethers.Contract(CONTRACT_ADDRESSES.AXIE, ABI_FILES.AXIE, signer),
    batchTransfer: new ethers.Contract(
      CONTRACT_ADDRESSES.ERC721_BATCH_TRANSFER,
      ABI_FILES.BATCH_TRANSFER,
      signer,
    ),
  };
}

export async function approveMarketplaceIfNeeded(
  axieContract: ethers.Contract,
  address: string,
): Promise<void> {
  const isApproved = await axieContract.isApprovedForAll(
    address,
    CONTRACT_ADDRESSES.MARKETPLACE_V2,
  );
  if (!isApproved) {
    console.info("🛠️ Approving the marketplace contract to transfer Axies...");
    const txApprove = await axieContract.setApprovalForAll(
      CONTRACT_ADDRESSES.MARKETPLACE_V2,
      true,
    );
    await txApprove.wait();
    console.log("✅ Contract approved, hash:", txApprove.hash);
  }
}

export async function approveBatchTransferIfNeeded(
  axieContract: ethers.Contract,
  address: string,
  batchTransferAddress: string,
): Promise<void> {
  const isApproved = await axieContract.isApprovedForAll(
    address,
    batchTransferAddress,
  );
  if (!isApproved) {
    console.info("🛠️ Approving batch transfer contract for all Axies...");
    const approveTx = await axieContract.setApprovalForAll(
      batchTransferAddress,
      true,
    );
    await approveTx.wait();
    console.log("✅ Batch transfer contract approved, hash:", approveTx.hash);
  }
}
