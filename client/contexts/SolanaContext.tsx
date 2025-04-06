import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useConnection,
  useAnchorWallet,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import idl from "../idl.json";
import { AnchorVotingProgram } from "../types/anchor_voting_program";

interface SolanaContextType {
  program?: anchor.Program<AnchorVotingProgram>;
  electionId: string;
  setElectionId: React.Dispatch<React.SetStateAction<string>>;
  electionTitle: string;
  setElectionTitle: React.Dispatch<React.SetStateAction<string>>;
  electionDescription: string;
  setElectionDescription: React.Dispatch<React.SetStateAction<string>>;
  candidateKey: string;
  setCandidateKey: React.Dispatch<React.SetStateAction<string>>;
  candidateName: string;
  setCandidateName: React.Dispatch<React.SetStateAction<string>>;
  candidateSlogan: string;
  setCandidateSlogan: React.Dispatch<React.SetStateAction<string>>;
  transactionUrl: string;
  setTransactionUrl: React.Dispatch<React.SetStateAction<string>>;
  electionPda: anchor.web3.PublicKey | null;
  candidatePda: anchor.web3.PublicKey | null;
  votePda: anchor.web3.PublicKey | null;
  contextPublicKey: anchor.web3.PublicKey | null;
}

const SolanaContext = createContext<SolanaContextType | undefined>(undefined);

export const SolanaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [contextPublicKey, setContextPublicKey] =
    useState<anchor.web3.PublicKey | null>(null);
  const { publicKey } = useWallet();

  const [program, setProgram] = useState<anchor.Program<AnchorVotingProgram>>();
  const [electionId, setElectionId] = useState("");
  const [electionTitle, setElectionTitle] = useState("");
  const [electionDescription, setElectionDescription] = useState("");
  const [candidateKey, setCandidateKey] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateSlogan, setCandidateSlogan] = useState("");
  const [transactionUrl, setTransactionUrl] = useState("");
  const [electionPda, setElectionPda] = useState<anchor.web3.PublicKey | null>(
    null
  );
  const [candidatePda, setCandidatePda] =
    useState<anchor.web3.PublicKey | null>(null);
  const [votePda, setVotePda] = useState<anchor.web3.PublicKey | null>(null);

  useEffect(() => {
    if (!wallet) return;
    setContextPublicKey(publicKey);

    let provider: anchor.Provider;
    try {
      provider = anchor.getProvider();
    } catch {
      provider = new anchor.AnchorProvider(connection, wallet, {});
      anchor.setProvider(provider);
    }

    const programInstance = new anchor.Program(
      idl as AnchorVotingProgram
    ) as anchor.Program<AnchorVotingProgram>;

    setProgram(programInstance);

    const [pdaForElection] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("election"),
        Buffer.from(electionId),
        wallet.publicKey.toBuffer(),
      ],
      programInstance.programId
    );
    setElectionPda(pdaForElection);

    const [pdaForCandidate] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("candidate"),
        Buffer.from(candidateKey),
        Buffer.from(electionId),
      ],
      programInstance.programId
    );
    setCandidatePda(pdaForCandidate);

    const [pdaForVote] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("vote"),
        Buffer.from(electionId),
        wallet.publicKey.toBuffer(),
      ],
      programInstance.programId
    );
    setVotePda(pdaForVote);
  }, [connection, wallet, electionId, candidateKey]);

  const contextValue = React.useMemo(
    () => ({
      program,
      electionId,
      setElectionId,
      electionTitle,
      setElectionTitle,
      electionDescription,
      setElectionDescription,
      transactionUrl,
      setTransactionUrl,
      candidateKey,
      setCandidateKey,
      candidateName,
      setCandidateName,
      candidateSlogan,
      setCandidateSlogan,
      electionPda,
      candidatePda,
      votePda,
      contextPublicKey,
    }),
    [
      program,
      electionId,
      setElectionId,
      electionTitle,
      setElectionTitle,
      electionDescription,
      setElectionDescription,
      transactionUrl,
      setTransactionUrl,
      candidateKey,
      setCandidateKey,
      candidateName,
      setCandidateName,
      candidateSlogan,
      setCandidateSlogan,
      electionPda,
      candidatePda,
      votePda,
      contextPublicKey,
    ]
  );

  return (
    <SolanaContext.Provider value={contextValue}>
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = (): SolanaContextType => {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error("useSolana must be used within a SolanaProvider");
  }
  return context;
};
