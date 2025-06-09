import { id, JsonRpcProvider } from "ethers";
import { abi } from "./abi";


const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/nnY0qPUQLYsUvb5BKJM5bh81sI6O0PQG");

const pool = async (blocknum: number) => {
  const logs = provider.getLogs({
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    fromBlock: blocknum,
    toBlock: blocknum + 2,
    topics: [id("Transfer(address,address,uint256)")]
  })
  console.log(logs);
}

pool(22668820)


