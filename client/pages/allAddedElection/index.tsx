import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useSolana } from "../../contexts/SolanaContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Link from "next/link";
import CandidateModal from "../../components/CandidateModal";

interface Election {
  electionId: string;
  electionTitle: string;
  electionDescription: string;
  electionGenerator: PublicKey;
  isActive: boolean;
}

const AllElections: NextPage = () => {
  const { program } = useSolana();
  const { publicKey } = useWallet();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchElections = async () => {
      if (!program) return;

      try {
        setLoading(true);
        // Fetch all election accounts
        const electionAccounts =
          await program.account.electionAccountState.all();

        // Transform the accounts into a more usable format
        const electionsData = electionAccounts.map((account) => ({
          electionId: account.account.electionId,
          electionTitle: account.account.electionTitle,
          electionDescription: account.account.electionDescription,
          electionGenerator: account.account.electionGenerator,
          isActive: account.account.isActive,
        }));

        setElections(electionsData);
      } catch (err) {
        console.error("Error fetching elections:", err);
        setError("Failed to fetch elections. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [program]);

  const isElectionOwner = (electionGenerator: PublicKey) => {
    return publicKey && electionGenerator.equals(publicKey);
  };

  const handleEditClick = (election: Election) => {
    setSelectedElection(election);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedElection(null);
  };

  const handleDeleteElection = async (electionId: string) => {
    if (!program || !publicKey) return;

    try {
      const [electionPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from("election"),
          Buffer.from(electionId),
          publicKey.toBuffer(),
        ],
        program.programId
      );

      await program.methods.closeElection(electionId).accounts({}).rpc();

      // Refresh elections list
      const electionAccounts = await program.account.electionAccountState.all();
      const electionsData = electionAccounts.map((account) => ({
        electionId: account.account.electionId,
        electionTitle: account.account.electionTitle,
        electionDescription: account.account.electionDescription,
        electionGenerator: account.account.electionGenerator,
        isActive: account.account.isActive,
      }));
      setElections(electionsData);
    } catch (err) {
      console.error("Error closing election:", err);
      setError("Failed to close election. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] py-6 flex flex-col sm:py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative py-3 sm:max-w-7xl sm:mx-auto px-4">
        <div className="relative px-4 py-10 backdrop-blur-xl bg-white/5 shadow-2xl sm:rounded-3xl sm:p-20 border border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                All Elections
              </h1>
              <p className="text-gray-400 text-sm">
                View all decentralized elections on Solana
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 bg-red-500/10 rounded-lg p-4 inline-block">
                  {error}
                </div>
              </div>
            ) : elections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No elections found.</p>
                <Link
                  href="/addElection"
                  className="mt-4 inline-block text-blue-400 hover:text-blue-300"
                >
                  Create your first election →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {elections.map((election) => (
                  <div
                    key={election.electionId}
                    className="group relative bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 transform hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                          {election.electionTitle}
                        </h2>
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              election.isActive
                                ? "bg-green-500/20 text-green-400 border border-green-500/20"
                                : "bg-red-500/20 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {election.isActive ? "Active" : "Closed"}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-6 line-clamp-3 group-hover:text-gray-300 transition-colors duration-200">
                        {election.electionDescription}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate max-w-[200px] text-gray-500 group-hover:text-gray-400 transition-colors duration-200">
                          ID: {election.electionId}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {isElectionOwner(election.electionGenerator) && (
                            <>
                              <span className="text-xs text-blue-400/70 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                                You created this
                              </span>
                              <button
                                onClick={() => handleEditClick(election)}
                                className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all duration-200 flex items-center gap-1.5 border border-yellow-500/20 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10 text-xs"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Add Candidates
                              </button>
                              {election.isActive && (
                                <button
                                  onClick={() =>
                                    handleDeleteElection(election.electionId)
                                  }
                                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center gap-1.5 border border-red-500/20 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 text-xs"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Close Election
                                </button>
                              )}
                            </>
                          )}
                          <Link
                            href={`/election/${election.electionId}`}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center gap-1.5 border border-blue-500/20 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 text-xs group"
                          >
                            View Details
                            <svg
                              className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-200"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedElection && (
        <CandidateModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          electionId={selectedElection.electionId}
          electionGenerator={selectedElection.electionGenerator}
        />
      )}

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

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Add smooth transitions for all interactive elements */
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default AllElections;
