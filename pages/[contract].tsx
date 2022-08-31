import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useAccount, useEnsName} from 'wagmi'

const Contract = () => {
  const router = useRouter()
  const { contract } = router.query
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address: contract as string })
  if(!ensName) {
      return <Typography textAlign="center">{contract as string}</Typography>
  }
  return <Typography textAlign="center">Name: {ensName}</Typography>
}

export default Contract