import dotenv from "dotenv";

dotenv.config();

export const config = {
  rpcUrl: "https://api.roninchain.com/rpc/",
  privateKey: process.env.PRIVATE_KEY!,
  accessToken: process.env.ACCESS_TOKEN!,
  skymavisApiKey: process.env.SKYMAVIS_DAPP_KEY!,
  graphqlUrl: "https://api-gateway.skymavis.com/graphql/axie-marketplace",
};
