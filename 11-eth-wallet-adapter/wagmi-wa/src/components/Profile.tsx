import { useAccount, useEnsName } from 'wagmi'

export function Profile() {
  // const { address } = useAccount()
  const { data, error, status } = useEnsName({ address: "0x3f351bB1208987817702F3066B647f116d09e058" })
  if (status === 'pending') return <div>Loading ENS name</div>
  if (status === 'error')
    return <div>Error fetching ENS name: {error.message}</div>
  return <div>ENS name: {data}</div>
}
