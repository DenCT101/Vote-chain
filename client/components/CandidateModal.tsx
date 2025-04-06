import React, { useState } from 'react';
import { useSolana } from '../contexts/SolanaContext';
import { PublicKey } from '@solana/web3.js';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  electionId: string;
  electionGenerator: PublicKey;
}

interface Candidate {
  candidateKey: string;
  candidateName: string;
  candidateSlogan: string;
}

const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  electionId,
  electionGenerator,
}) => {
  const { program } = useSolana();
  const [candidates, setCandidates] = useState<Candidate[]>([
    { candidateKey: '', candidateName: '', candidateSlogan: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCandidateKey = (index: number) => {
    // Generate a random string of 6 characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    updateCandidate(index, 'candidateKey', result);
  };

  const addCandidateField = () => {
    setCandidates([...candidates, { candidateKey: '', candidateName: '', candidateSlogan: '' }]);
  };

  const removeCandidateField = (index: number) => {
    const newCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(newCandidates);
  };

  const updateCandidate = (index: number, field: keyof Candidate, value: string) => {
    const newCandidates = [...candidates];
    newCandidates[index] = { ...newCandidates[index], [field]: value };
    setCandidates(newCandidates);
  };

  const handleSubmit = async () => {
    if (!program) return;

    try {
      setLoading(true);
      setError(null);

      for (const candidate of candidates) {
        await program.methods
          .addCandidate(
            candidate.candidateKey,
            electionId,
            candidate.candidateName,
            candidate.candidateSlogan
          )
          .accounts({
            candidate: await PublicKey.findProgramAddress(
              [
                Buffer.from('candidate'),
                Buffer.from(candidate.candidateKey),
                Buffer.from(electionId),
              ],
              program.programId
            ),
            election: await PublicKey.findProgramAddress(
              [
                Buffer.from('election'),
                Buffer.from(electionId),
                electionGenerator.toBuffer(),
              ],
              program.programId
            ),
            electionGenerator: electionGenerator,
            systemProgram: new PublicKey('11111111111111111111111111111111'),
          })
          .rpc();
      }

      onClose();
    } catch (err) {
      console.error('Error adding candidates:', err);
      setError('Failed to add candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#1E293B] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add Candidates</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {candidates.map((candidate, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Candidate {index + 1}</h3>
                {candidates.length > 1 && (
                  <button
                    onClick={() => removeCandidateField(index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Candidate Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={candidate.candidateKey}
                      onChange={(e) => updateCandidate(index, 'candidateKey', e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter unique key"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => generateCandidateKey(index)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    value={candidate.candidateName}
                    onChange={(e) => updateCandidate(index, 'candidateName', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter candidate name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Candidate Slogan
                  </label>
                  <input
                    type="text"
                    value={candidate.candidateSlogan}
                    onChange={(e) => updateCandidate(index, 'candidateSlogan', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter candidate slogan"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={addCandidateField}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/20 hover:border-blue-500/30"
          >
            Add Another Candidate
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
          >
            {loading ? 'Adding Candidates...' : 'Save Candidates'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal; 