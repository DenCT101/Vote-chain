use crate::{constants::*, contexts::*, errors::*};
use anchor_lang::prelude::*;

pub fn add_candidate(
    ctx: Context<AddCandidate>,
    candidate_key: String,
    election_id: String,
    candidate_name: String,
    candidate_slogan: String,
) -> Result<()> {
    require!(
        candidate_key.len() <= MAX_CANDIDATEKEY_LENGTH,
        CandidateAccountError::CANDIDATEKEYTOOLONG
    );

    require!(
        election_id.len() <= MAX_ELECTIONID_LENGTH,
        CandidateAccountError::ElectionIdTooLong
    );

    require!(
        candidate_name.len() <= MAX_CANDIDATE_NAME_LENGTH,
        CandidateAccountError::CandidateNameTooLong
    );

    require!(
        candidate_slogan.len() <= MAX_CANDIDATE_SLOGAN_LENGTH,
        CandidateAccountError::CandidateSloganTooLong
    );

    // Validate that the election exists
    let election = &mut ctx.accounts.election;
    require!(
        election.election_id == election_id,
        CandidateAccountError::ElectionDoesNotExist
    );

    let candidate = &mut ctx.accounts.candidate;
    candidate.election_id = election_id.trim().to_string();
    candidate.candidate_key = candidate_key.trim().to_string();
    candidate.candidate_name = candidate_name.trim().to_string();
    candidate.candidate_slogan = candidate_slogan.trim().to_string();
    candidate.vote_counts = 0;
    Ok(())
}
