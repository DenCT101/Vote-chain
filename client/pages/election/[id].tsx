import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useSolana } from "../../contexts/SolanaContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Link from "next/link";

interface Candidate {
  candidateKey: string;
  candidateName: string;
  candidateSlogan: string;
  voteCounts: number;
}

interface Election {
  electionId: string;
  electionTitle: string;
  electionDescription: string;
  electionGenerator: PublicKey;
  isActive: boolean;
}

interface VoteStatus {
  hasVoted: boolean;
  votedFor: string | null;
}

const ElectionDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { program } = useSolana();
  const { publicKey } = useWallet();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>({ hasVoted: false, votedFor: null });

  useEffect(() => {
    const fetchElectionDetails = async () => {
      if (!program || !id || !publicKey) return;

      try {
        setLoading(true);
        // First, fetch all election accounts to find the one with matching ID
        const allElectionAccounts = await program.account.electionAccountState.all();
        const electionAccount = allElectionAccounts.find(
          account => account.account.electionId === id
        );

        if (!electionAccount) {
          setElection(null);
          setCandidates([]);
          return;
        }

        // Now we have the election account and its generator
        setElection({
          electionId: electionAccount.account.electionId,
          electionTitle: electionAccount.account.electionTitle,
          electionDescription: electionAccount.account.electionDescription,
          electionGenerator: electionAccount.account.electionGenerator,
          isActive: electionAccount.account.isActive,
        });

        // Fetch all candidates and filter by election ID
        const allCandidateAccounts = await program.account.candidateAccountState.all();
        const candidatesData = allCandidateAccounts
          .filter(account => account.account.electionId === id)
          .map(account => ({
            candidateKey: account.account.candidateKey,
            candidateName: account.account.candidateName,
            candidateSlogan: account.account.candidateSlogan,
            voteCounts: account.account.voteCounts,
          }));

        setCandidates(candidatesData);

        // Check if user has already voted
        const [votePda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("vote"),
            Buffer.from(id as string),
            publicKey.toBuffer(),
          ],
          program.programId
        );

        try {
          const voteAccount = await program.account.voteAccount.fetch(votePda);
          setVoteStatus({
            hasVoted: true,
            votedFor: voteAccount.candidateKey,
          });
        } catch (err) {
          // Vote account doesn't exist, user hasn't voted yet
          setVoteStatus({ hasVoted: false, votedFor: null });
        }
      } catch (err) {
        console.error("Error fetching election details:", err);
        setError("Failed to fetch election details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchElectionDetails();
  }, [program, id, publicKey]);

  const handleVote = async () => {
    if (!program || !id || !selectedCandidate || !publicKey) return;

    try {
      setVoting(true);
      
      // Call the addVote instruction - Anchor will automatically resolve the accounts
      await program.methods
        .addVote(id as string, selectedCandidate)
        .accounts({})
        .rpc();

      setVoteSuccess(true);
      // Refresh candidates to update vote counts
      const allCandidateAccounts = await program.account.candidateAccountState.all();
      const updatedCandidates = allCandidateAccounts
        .filter(account => account.account.electionId === id)
        .map(account => ({
          candidateKey: account.account.candidateKey,
          candidateName: account.account.candidateName,
          candidateSlogan: account.account.candidateSlogan,
          voteCounts: account.account.voteCounts,
        }));

      setCandidates(updatedCandidates);
    } catch (err) {
      console.error("Error voting:", err);
      setError("Failed to submit vote. Please try again.");
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-red-400 bg-red-500/10 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-[#0F172A] py-6 flex flex-col sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative py-3 sm:max-w-7xl sm:mx-auto px-4">
          <div className="relative px-4 py-10 backdrop-blur-xl bg-white/5 shadow-2xl sm:rounded-3xl sm:p-20 border border-white/10">
            <div className="max-w-6xl mx-auto text-center">
              <Link 
                href="/allAddedElection"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Elections
              </Link>

              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Election Not Found
              </h1>
              <p className="text-gray-400 mb-8">
                The election you're looking for doesn't exist or hasn't been initialized yet.
              </p>
              <Link 
                href="/allAddedElection"
                className="inline-block px-6 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200 border border-blue-500/20 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10"
              >
                View All Elections
              </Link>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }

          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
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
        `}</style>
      </div>
    );
  }

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
            <Link 
              href="/allAddedElection"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 group transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Elections
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                {election.electionTitle}
              </h1>
              <p className="text-gray-400 text-sm mb-4 max-w-2xl mx-auto leading-relaxed">
                {election.electionDescription}
              </p>
              <div className="flex items-center justify-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  election.isActive 
                    ? "bg-green-500/20 text-green-400 border border-green-500/20 hover:bg-green-500/30" 
                    : "bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30"
                }`}>
                  {election.isActive ? "Active" : "Closed"}
                </span>
                {voteStatus.hasVoted && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/20 animate-pulse">
                    You have already voted
                  </span>
                )}
              </div>
            </div>

            {candidates.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg">No candidates have been added yet.</p>
                <p className="text-gray-500 text-sm mt-2">Check back later to see the candidates.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.candidateKey}
                    className={`group relative bg-white/5 rounded-xl p-6 border transition-all duration-300 ${
                      selectedCandidate === candidate.candidateKey
                        ? "border-blue-500 shadow-lg shadow-blue-500/20 scale-105"
                        : voteStatus.hasVoted && voteStatus.votedFor === candidate.candidateKey
                        ? "border-green-500 shadow-lg shadow-green-500/20 scale-105"
                        : "border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10"
                    } transform hover:-translate-y-1`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">
                          {candidate.candidateName}
                        </h3>
                        <span className="text-blue-400 text-sm bg-blue-500/10 px-3 py-1 rounded-full">
                          {candidate.voteCounts} votes
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {candidate.candidateSlogan}
                      </p>
                      <div className="flex items-center justify-between">
                        {election.isActive && !voteStatus.hasVoted && (
                          <button
                            onClick={() => setSelectedCandidate(candidate.candidateKey)}
                            className={`px-4 py-1.5 rounded-lg transition-all duration-200 ${
                              selectedCandidate === candidate.candidateKey
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:bg-blue-500/30"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                            }`}
                          >
                            {selectedCandidate === candidate.candidateKey ? (
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Selected
                              </span>
                            ) : (
                              "Select"
                            )}
                          </button>
                        )}
                        {voteStatus.hasVoted && voteStatus.votedFor === candidate.candidateKey && (
                          <span className="px-4 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/20 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Your Vote
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {election.isActive && selectedCandidate && !voteSuccess && !voteStatus.hasVoted && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleVote}
                  disabled={voting}
                  className="px-8 py-4 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center gap-2 border border-blue-500/20 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 mx-auto group"
                >
                  {voting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-400"></div>
                      Submitting Vote...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submit Vote
                    </>
                  )}
                </button>
              </div>
            )}

            {voteSuccess && (
              <div className="mt-8 text-center animate-fade-in">
                <div className="inline-block bg-green-500/20 text-green-400 px-6 py-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Vote submitted successfully!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ElectionDetails; 