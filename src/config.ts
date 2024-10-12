import dotenv from "dotenv";

dotenv.config();

export const config = {
  rpcUrl: process.env.SKYMAVIS_DAPP_KEY
    ? `https://api-gateway.skymavis.com/rpc?apikey=${process.env.SKYMAVIS_DAPP_KEY}`
    : "https://api.roninchain.com/rpc/",
  privateKey: process.env.PRIVATE_KEY!,
  accessToken: process.env.ACCESS_TOKEN!,
  skymavisApiKey: process.env.SKYMAVIS_DAPP_KEY,
  graphqlUrl: process.env.SKYMAVIS_DAPP_KEY
    ? "https://api-gateway.skymavis.com/graphql/axie-marketplace"
    : "https://graphql-gateway.axieinfinity.com/graphql",
};
