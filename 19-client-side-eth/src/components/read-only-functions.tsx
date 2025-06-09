import { useReadContract } from 'wagmi'

export const abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'supply', type: 'uint256' }],
  },
] as const

const TotalSupply = () => {
  // [x] https://wagmi.sh/react/api/hooks/useReadContract
  const { data, isLoading, error, isError } = useReadContract({
    abi,
    address: '0x36160274B0ED3673E67F2CA5923560a7a0c523aa',
    functionName: 'totalSupply',
    // account: '0xdfddfm',
    // args: []
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <p>Error : {error.message}</p>
  }

  return (
    <p>
      Total Supply : {data?.toString()}
    </p>
  )
}

export { TotalSupply }


/**
 * import { useReadContract } from 'wagmi'
import { contract } from './contract'

export function TotalBalance() {
  const { data, isLoading, error } = useReadContract({
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    abi: [
      {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    ],
    functionName: 'balanceOf',
    args: ["0x587EFaEe4f308aB2795ca35A27Dff8c1dfAF9e3f"]
  })

  return (
    <div>
        Balance  - {JSON.stringify(data?.toString())}
    </div>
  )
}
 */
