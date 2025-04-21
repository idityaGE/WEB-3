import { type BaseError, useReadContracts } from "wagmi"
import { abi } from "../configs/abi"

const ReadContract = () => {
  const { data, error, isPending } = useReadContracts({
    contracts: [
      {
        address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
        abi,
        functionName: 'balanceOf',
        args: ['0x770C6CbF7B75fCc874C9f642ae276B6d51fcb6FE'],
      },
      {
        address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
        abi,
        functionName: 'totalSupply',
      }
    ]
  })

  console.log(data)

  const [balance, totalSupply] = data || []

  if (isPending) return <div>Loading...</div>

  if (error)
    return (
      <div>
        Error: {(error as unknown as BaseError).shortMessage || error.message}
      </div>
    )

  return (
    <div>
      <div>Balance: {balance?.result?.toString()}</div>
      <div>Total Supply: {totalSupply?.result?.toString()}</div>
    </div>
  )
}

export default ReadContract
