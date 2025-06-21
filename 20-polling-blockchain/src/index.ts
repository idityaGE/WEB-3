import { id, JsonRpcProvider } from "ethers";
import { abi } from "./abi";
import fs from "fs"
import path from "path"

const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/6s3M6O862JJ2S98EbpasJYhdq9dJE0GN");

const pool = async (blocknum: number) => {
  const logs = await provider.getLogs({
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    fromBlock: blocknum,
    toBlock: blocknum + 2,
    topics: [id("Transfer(address,address,uint256)")]
  })
  return logs;
}


pool(22746443)
  .then((data) => {
    fs.writeFile("data.json", JSON.stringify(data, null, 2), "utf-8", (err) => {
      if (err) console.error(err);
      console.log("Data written to file");
    });
  })



