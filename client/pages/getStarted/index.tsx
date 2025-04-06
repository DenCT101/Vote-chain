import React, { useState } from "react";
import { NextPage } from "next";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";
require("@solana/wallet-adapter-react-ui/styles.css");

const Home: NextPage = () => {
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);
  const { publicKey } = useWallet();
  const router = useRouter();

  const handleBoxClick = (title: string) => {
    switch (title) {
      case "Add Election":
        router.push("/addElection");
        break;
      case "See Your Added Elections":
        router.push("/allAddedElection");
        break;
      case "Vote Now":
        router.push("/allAddedElection");
        break;
      case "Running Elections":
        router.push("/allAddedElection");
        break;
      // Add other navigation cases here
      default:
        console.log("Navigation not implemented for:", title);
    }
  };

  const boxes = [
    {
      title: "Add Election",
      description: "Create a new election",
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      borderColor: "border-green-500",
      textColor: "text-green-400",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      title: "Vote Now",
      description: "Cast your vote in active elections",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      borderColor: "border-blue-500",
      textColor: "text-blue-400",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "See Your Added Elections",
      description: "View elections you've created",
      color: "bg-orange-600",
      hoverColor: "hover:bg-orange-700",
      borderColor: "border-orange-500",
      textColor: "text-orange-400",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: "Running Elections",
      description: "View currently active elections",
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      borderColor: "border-purple-500",
      textColor: "text-purple-400",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-white">
          Solana Voting System
        </h1>

        {publicKey ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boxes.map((box, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-lg border ${
                  box.borderColor
                } bg-gray-800 shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-${
                  box.color.split("-")[1]
                }-500/20 cursor-pointer`}
                onMouseEnter={() => setHoveredBox(box.title)}
                onMouseLeave={() => setHoveredBox(null)}
                onClick={() => handleBoxClick(box.title)}
              >
                <div
                  className={`${box.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}
                >
                  {box.icon}
                </div>
                <h2
                  className={`text-xl font-semibold text-center mb-2 ${box.textColor}`}
                >
                  {box.title}
                </h2>
                <p className="text-gray-400 text-center mb-4">
                  {box.description}
                </p>
                <button
                  className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${box.color} ${box.hoverColor}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBoxClick(box.title);
                  }}
                >
                  {box.title}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="text-2xl text-gray-400 text-center">
              Please connect your wallet to continue
            </div>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
