import React from "react";
import "./globals.css";
import type { AppProps } from "next/app";
import WalletContextProvider from "../components/WalletContextProvider";
import { AppBar } from "../components/AppBar";
import { SolanaProvider } from "../contexts/SolanaContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <SolanaProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <AppBar />
          <main className="container mx-auto px-4 py-6">
            <Component {...pageProps} />
          </main>
        </div>
      </SolanaProvider>
    </WalletContextProvider>
  );
}

export default MyApp;
