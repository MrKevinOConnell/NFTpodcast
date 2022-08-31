import * as React from 'react'
import { useAccount, useConnect, useEnsName, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { Button } from '@mui/material'
import { disconnect } from 'process'
import { InjectedConnector } from 'wagmi/connectors/injected'

function SignInButton({
  onSuccess,
  onError,
}: {
  onSuccess: (args: { address: string }) => void
  onError: (args: { error: Error }) => void
}) {

  const [state, setState] = React.useState<{
    loading?: boolean
    nonce?: string
  }>({})

  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch('/api/nonce')
      const nonce = await nonceRes.text()
      console.log("nonce",nonce)
      setState((x) => ({ ...x, nonce }))
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }))
    }
  }
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  React.useEffect(() => {
    fetchNonce()
  }, [])

  const { chain: activeChain } = useNetwork()
  const { signMessageAsync } = useSignMessage()
  const { isConnected, address } = useAccount()
  const signIn = async () => {
    try { 
      const chainId = activeChain?.id
      if (!address || !chainId) return
      console.log("add",address)
      setState((x) => ({ ...x, loading: true }))
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: state.nonce,
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })

      // Verify signature
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      })
      console.log("verify",verifyRes)
      if (!verifyRes.ok) throw new Error('Error verifying message')

      setState((x) => ({ ...x, loading: false }))
      onSuccess({ address })
    } catch (error) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }))
      onError({ error: error as Error })
      fetchNonce()
    }
  }

  return isConnected ? (
    <Button suppressHydrationWarning={true} variant="contained" disabled={!state.nonce || state.loading} onClick={signIn}>
      Sign-In with Ethereum
    </Button>
  ) : <Button suppressHydrationWarning={true} variant="contained" onClick={() => connect()}>Connect wallet</Button>
}

export function Profile(props:{onClick:(e: any)=>void},suppressHydrationWarning: true) {
    
  const { isConnected, address } = useAccount()

  const [state, setState] = React.useState<{
    address?: string
    error?: Error
    loading?: boolean
  }>({})
  const { data: ensName } = useEnsName({ address })

  // Fetch user when:
  React.useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch('/api/me')
        const json = await res.json()
        if(!json.address && isConnected) {
            logout()
          }
        setState((x) => ({ ...x, address: json.address }))
      } catch (_error) {}
    }
    // 1. page loads
    handler()

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [])
  const logout =async () => {
    await fetch('/api/logout')
    setState({})
  }
    if(state.address) {
        return (<Button suppressHydrationWarning variant="contained"
        onClick={async (e) => {
          props.onClick(e)
        }}
      >
       {ensName}
      </Button>)
    }
    else {
       return <SignInButton 
        onSuccess={({ address }) => setState((x) => ({ ...x, address }))}
        onError={({ error }) => setState((x) => ({ ...x, error }))}
      />    
    }

  }
