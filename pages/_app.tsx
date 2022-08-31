import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import ResponsiveAppBar from "./ResponsiveAppBar";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from "react";
import * as IPFS from 'ipfs-core'
import { create } from "ipfs-http-client";
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
const { chains, provider } = configureChains(defaultChains, [publicProvider()])

const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
})

export const lightTheme = createTheme({
  palette: {
    mode: 'light'
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [mode,setMode] = useState('light')
 
  return (
    <WagmiConfig client={client}>
       <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <ResponsiveAppBar mode={mode} onModeChange={(mode) => setMode(mode)}/>
      <Component {...pageProps} />
      </ThemeProvider>
      </WagmiConfig>
  );
}
