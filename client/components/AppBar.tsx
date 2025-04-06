import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

export const AppBar: FC = () => {
  const { publicKey } = useWallet();

  return (
    <header className="bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-6 mb-4 md:mb-0">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/solanaLo.png"
              height={30}
              width={120}
              alt="Solana Logo"
              style={{ height: "auto" }} // Maintain aspect ratio
            />
          </Link>
        </div>

        {/* Title Section */}
        <div className="flex items-center justify-center mb-4 md:mb-0">
          <span className="text-xl font-semibold text-white flex items-center">
            Voting Application
          </span>
        </div>

        {/* Wallet Button Section */}
        <div className="flex items-center space-x-4">
          <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition shadow-md" />
        </div>
      </div>
    </header>
  );
};

export default AppBar;