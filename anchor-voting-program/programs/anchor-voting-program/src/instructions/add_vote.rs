use crate::{constants::*, contexts::*, errors::*};
use anchor_lang::prelude::*;

pub fn add_vote(ctx: Context<AddVote>, election_id: String, candidate_key: String) -> Result<()> {
    require!(
        election_id.len() <= MAX_ELECTIONID_LENGTH,
        VoterAccountError::ElectionIdTooLong
    );

    require!(
        candidate_key.len() <= MAX_CANDIDATEKEY_LENGTH,
        CandidateAccountError::CANDIDATEKEYTOOLONG
    );

    let candidate = &mut ctx.accounts.candidate;
    require!(
        candidate.election_id == election_id,
        VoterAccountError::CandidateNotFound
    );

    candidate.vote_counts = candidate.vote_counts.checked_add(1).unwrap();

    let voter = &mut ctx.accounts.voter;
    voter.voter = ctx.accounts.voter_signer.key();
    voter.election_id = election_id.trim().to_string();
    voter.candidate_key = candidate_key.trim().to_string();
    Ok(())
}
