import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorVotingProgram } from "../target/types/anchor_voting_program";
import { expect } from "chai";

describe("anchor-voting-program", async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorVotingProgram as Program<AnchorVotingProgram>;

  const election = {
    title: "Lok Sabha Election",
    description: "PM election",
    election_id: "12345",
  };
  const anotherElection = {
    title: "Vidhan Sabha",
    description: "CM Bihar election",
    election_id: "123456",
  };

  const candidate1 = {
    candidate_key: "100",
    candidate_name: "Nitish Kumar",
    candidate_slogan: "Mein tho Bihar ko lutunga",
  };

  const candidate2 = {
    candidate_key: "101",
    candidate_name: "Tejashwi yadav",
    candidate_slogan: "Mein Bihar ko lutunga",
  };

  const [vote1Pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("vote"),
      Buffer.from(election.election_id),
      provider.wallet.publicKey.toBuffer(),
    ],
    program.programId
  );

  const [candidate1Pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("candidate"),
      Buffer.from(candidate1.candidate_key),
      Buffer.from(election.election_id),
    ],
    program.programId
  );

  const [candidate2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("candidate"),
      Buffer.from(candidate2.candidate_key),
      Buffer.from(election.election_id),
    ],
    program.programId
  );

  const [anotherElectionPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("election"),
      Buffer.from(anotherElection.election_id),
      provider.wallet.publicKey.toBuffer(),
    ],
    program.programId
  );

  const [electionPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("election"),
      Buffer.from(election.election_id),
      provider.wallet.publicKey.toBuffer(),
    ],
    program.programId
  );

  it("adds a election", async () => {
    try {
      await program.methods
        .createElection(
          election.election_id,
          election.title,
          election.description
        )
        .accounts({})
        .rpc();

      const account = await program.account.electionAccountState.fetch(
        electionPda
      );
      expect(account.electionId).to.equal(election.election_id);
      expect(account.electionTitle).to.equal(election.title);
      expect(account.electionDescription).to.equal(election.description);
      expect(account.electionGenerator.toString()).to.equal(
        provider.wallet.publicKey.toString()
      );
    } catch (error) {
      console.error("Error adding election:", error);
      throw error;
    }
  });

  it("adds another election", async () => {
    try {
      await program.methods
        .createElection(
          anotherElection.election_id,
          anotherElection.title,
          anotherElection.description
        )
        .accounts({})
        .rpc();

      const account = await program.account.electionAccountState.fetch(
        anotherElectionPda
      );
      expect(account.electionId).to.equal(anotherElection.election_id);
      expect(account.electionTitle).to.equal(anotherElection.title);
      expect(account.electionDescription).to.equal(anotherElection.description);
      expect(account.electionGenerator.toString()).to.equal(
        provider.wallet.publicKey.toString()
      );
    } catch (error) {
      console.error("Error adding election:", error);
      throw error;
    }
  });

  it("adds a candidate", async () => {
    try {
      await program.methods
        .addCandidate(
          candidate1.candidate_key,
          election.election_id,
          candidate1.candidate_name,
          candidate1.candidate_slogan
        )
        .accounts({})
        .rpc();

      const account = await program.account.candidateAccountState.fetch(
        candidate1Pda
      );
      expect(account.candidateKey).to.equal(candidate1.candidate_key);
      expect(account.candidateName).to.equal(candidate1.candidate_name);
      expect(account.candidateSlogan).to.equal(candidate1.candidate_slogan);
      expect(account.electionId).to.equal(election.election_id);
    } catch (error) {
      console.error("Error adding candidate:", error);
      throw error;
    }
  });

  it("adds another candidate", async () => {
    try {
      await program.methods
        .addCandidate(
          candidate2.candidate_key,
          election.election_id,
          candidate2.candidate_name,
          candidate2.candidate_slogan
        )
        .accounts({})
        .rpc();

      const account = await program.account.candidateAccountState.fetch(
        candidate2Pda
      );
      expect(account.candidateKey).to.equal(candidate2.candidate_key);
      expect(account.candidateName).to.equal(candidate2.candidate_name);
      expect(account.candidateSlogan).to.equal(candidate2.candidate_slogan);
      expect(account.electionId).to.equal(election.election_id);
      expect(account.voteCounts).to.equal(0);
    } catch (error) {
      console.error("Error adding candidate:", error);
      throw error;
    }
  });

  it("adds a vote", async () => {
    try {
      await program.methods
        .addVote(election.election_id, candidate1.candidate_key)
        .accounts({})
        .rpc();

      const account = await program.account.voteAccount.fetch(vote1Pda);
      const countVoteAccount =
        await program.account.candidateAccountState.fetch(candidate1Pda);
      expect(account.candidateKey).to.equal(candidate1.candidate_key);
      expect(account.electionId).to.equal(election.election_id);
      expect(countVoteAccount.voteCounts).to.equal(1);
    } catch (error) {
      console.error("Error adding candidate:", error);
      throw error;
    }
  });

  it("close election", async () => {
    try {
      await program.methods
        .closeElection(election.election_id)
        .accounts({})
        .rpc();

      const account = await program.account.electionAccountState.fetchNullable(
        electionPda
      );
      expect(account).to.be.null;
    } catch (error) {
      console.error("Error adding election:", error);
      throw error;
    }
  });
});
