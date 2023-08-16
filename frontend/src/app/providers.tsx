"use client"

require("dotenv").config();
import { useEffect, useState } from "react";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID as string }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'nagoya-blockchain-hackathon',
  // projectId: process.env.WALLET_CONECT_PROJECT_ID as string,
  projectId: "253217ec42b4b253e1003de75d5887cb",
  chains
});

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
};

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      {/* <RainbowKitProvider chains={chains} appInfo={demoAppInfo}> */}
      <RainbowKitProvider chains={chains}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}