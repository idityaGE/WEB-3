import { createPublicClient, http } from 'viem'
import { holesky } from 'viem/chains'

const client = createPublicClient({
  chain: holesky, // keep the note the its not the mainnet
  transport: http(),
})

const blockNumber = await client.getBlockNumber()

console.log("latest block hash :", blockNumber)

const balance = await client.getBalance({ address: "0x3f351bB1208987817702F3066B647f116d09e058" })

console.log("Balance in wei (10^-18) : ", balance)
