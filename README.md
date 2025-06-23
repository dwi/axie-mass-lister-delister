# App.Axie Mass Lister/Delister

A very simple command-line tool for mass managing App.Axie marketplace listings, built with TypeScript and Ethers.js.

> This tool was created in 2 hours as a bounty for ak. For more details, see the [original tweet](https://x.com/0xak_/status/1845189115438100648).

## Features

- List Axies on the marketplace from a CSV file for a specific price
- Cancel all active listings (using batch transfer to self)

## Prerequisites

- Node.js 18+
- npm, pnpm, yarn or bun
- Access Token from <https://app.axieinfinity.com/>
- SkyMavis API Key from <https://developers.skymavis.com/>

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dwi/axie-mass-lister-delister
   cd axie-mass-lister-delister
   ```

2. Install dependencies:

   ```bash
   npm install
   pnpm i
   yarn
   bun i
   ```

3. Copy the `.env.example` file to `.env`:

    ```bash
    cp .env.example .env
    ```

4. Fill in the values:

   ```env
   PRIVATE_KEY=your_ronin_wallet_private_key
   ACCESS_TOKEN=your_app.axie_access_token
   SKYMAVIS_DAPP_KEY=your_skymavis_api_key
   ```

## Usage

Run the script using:

   ```bash
   npm run start
   pnpm start
   yarn start
   bun start
   ```

## Possible Future Improvements

- Implement multicall to check Axie ownerships in batch instead of one by one
- Utilize aliases to retrieve more than 100 listed Axies at once
- Support auction listings
