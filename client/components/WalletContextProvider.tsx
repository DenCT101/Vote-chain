"use client";
import { FC, ReactNode, useEffect, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as web3 from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const endpoint = web3.clusterApiUrl("devnet");
  const wallets = [new PhantomWalletAdapter()];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletAutoReconnect />
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const WalletAutoReconnect = () => {
  const { publicKey, connect, disconnect, connected } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      localStorage.setItem("walletPublicKey", publicKey.toBase58());
    }
  }, [connected, publicKey]);

  useEffect(() => {
    const savedPublicKey = localStorage.getItem("walletPublicKey");
    if (savedPublicKey && !connected) {
      connect().catch(console.error);
    }
  }, []);

  return null;
};

export default WalletContextProvider;
