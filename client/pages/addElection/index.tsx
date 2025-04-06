import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useSolana } from "../../contexts/SolanaContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";

const AddElection: NextPage = () => {
  const {
    program,
    electionId,
    setElectionId,
    electionTitle,
    setElectionTitle,
    electionDescription,
    setElectionDescription,
    electionPda,
    setTransactionUrl,
    transactionUrl,
  } = useSolana();
  const { publicKey } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateElectionId = () => {
    // Generate a random string of 8 characters
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setElectionId(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program || !publicKey || !electionPda) return;

    try {
      setLoading(true);
      const tx = await program.methods
        .createElection(electionId, electionTitle, electionDescription)
        .accounts({})
        .rpc();

      setTransactionUrl(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
      setSuccess(true);
      // Clear form
      setElectionTitle("");
      setElectionDescription("");
      setElectionId("");
    } catch (error) {
      console.error("Error creating election:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] py-6 flex flex-col justify-center sm:py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-3000"></div>
      </div>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 backdrop-blur-xl bg-white/5 shadow-2xl sm:rounded-3xl sm:p-20 border border-white/10 hover:border-white/20 transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="max-w-md mx-auto relative">
            <div className="divide-y divide-white/10">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-300 sm:text-lg sm:leading-7">
                <div className="text-center mb-8 transform hover:scale-105 transition-transform duration-300">
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                    Create New Election
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Set up a new decentralized election on Solana
                  </p>
                </div>

                {success && (
                  <div className="mb-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-400 mr-2 animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <p className="text-green-400 font-medium">
                        Election created successfully!
                      </p>
                    </div>
                    <a
                      href={transactionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 mt-2 inline-flex items-center text-sm group"
                    >
                      View Transaction
                      <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        ></path>
                      </svg>
                    </a>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-400 transition-colors duration-200">
                      Election ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={electionId}
                        onChange={(e) => setElectionId(e.target.value)}
                        className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-white/20"
                        required
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={generateElectionId}
                        className="mt-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-400 transition-colors duration-200">
                      Election Title
                    </label>
                    <input
                      type="text"
                      value={electionTitle}
                      onChange={(e) => setElectionTitle(e.target.value)}
                      className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-white/20"
                      required
                      placeholder="Enter election title"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="block text-sm font-medium text-gray-300 group-hover:text-blue-400 transition-colors duration-200">
                      Election Description
                    </label>
                    <textarea
                      value={electionDescription}
                      onChange={(e) => setElectionDescription(e.target.value)}
                      className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-white/20 resize-none"
                      rows={4}
                      required
                      placeholder="Enter election description"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading || !publicKey || !electionId}
                      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-300 ${
                        loading || !publicKey || !electionId
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25"
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        "Create Election"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Add smooth transitions for all interactive elements */
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Add hover effect for the entire card */
        .group:hover {
          transform: translateY(-2px);
        }

        /* Add glow effect on focus */
        input:focus,
        textarea:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }

        /* Add subtle hover effect for inputs */
        input:hover,
        textarea:hover {
          background-color: rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  );
};

export default AddElection;
