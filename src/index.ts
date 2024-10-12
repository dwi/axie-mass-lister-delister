import { listAxies } from "./marketplace-list";
import { delistAxies } from "./marketplace-delist";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { getSigner } from "./utils";

async function main() {
  try {
    const walletAddress = await getSigner().getAddress();
    console.log(
      `Welcome! Your wallet address is: ${walletAddress.slice(
        0,
        3,
      )}...${walletAddress.slice(-4)}`,
    );

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "List Axies from .csv", value: "list" },
          { name: "Cancel all listings", value: "cancel" },
        ],
      },
    ]);

    if (action === "list") {
      let csvFiles: string[];
      try {
        csvFiles = fs
          .readdirSync(".")
          .filter((file) => path.extname(file).toLowerCase() === ".csv");
      } catch (error) {
        console.error("❌ Error reading directory:", error);
        return;
      }

      if (csvFiles.length === 0) {
        console.error("❌ No CSV files found in the current directory.");
        return;
      }

      const { selectedFile } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedFile",
          message: "Select a CSV file:",
          choices: csvFiles,
        },
      ]);

      await listAxies(selectedFile);
    } else if (action === "cancel") {
      await delistAxies();
    }
  } catch (error) {
    console.error("❌ An error occurred:", error);
  }
}

main();
