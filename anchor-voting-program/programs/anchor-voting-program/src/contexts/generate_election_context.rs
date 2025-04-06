use crate::{constants::*, state::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(election_id:String)]
pub struct CreateElection<'info> {
    #[account(
        init,
        seeds=["election".as_bytes(),election_id.as_bytes(),election_generator.key().as_ref()],
        bump,
        payer=election_generator,
        space=ElectionAccountState::INIT_SPACE + MAX_ELECTIONID_LENGTH + MAX_TITLE_LENGTH + MAX_DESCRIPTION_LENGTH
    )]
    pub election: Account<'info, ElectionAccountState>,
    #[account(mut)]
    pub election_generator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(election_id:String)]
pub struct CloseElection<'info> {
    #[account(
        mut,
        seeds=["election".as_bytes(), election_id.as_bytes(), election_generator.key().as_ref()],
        bump,
        close = election_generator
    )]
    pub election: Account<'info, ElectionAccountState>,
    #[account(mut)]
    pub election_generator: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction(candidate_key:String, election_id:String)]
pub struct AddCandidate<'info> {
    #[account(
        init,
        seeds=["candidate".as_bytes(), candidate_key.as_bytes(), election_id.as_bytes()],
        bump,
        payer=election_generator,
        space=CandidateAccountState::INIT_SPACE + MAX_ELECTIONID_LENGTH + MAX_CANDIDATEKEY_LENGTH + MAX_CANDIDATE_NAME_LENGTH + MAX_CANDIDATE_SLOGAN_LENGTH
    )]
    pub candidate: Account<'info, CandidateAccountState>,

    #[account(
        mut,
        seeds = ["election".as_bytes(), election_id.as_bytes(),election_generator.key().as_ref()],
        bump,
        has_one = election_generator
    )]
    pub election: Account<'info, ElectionAccountState>,

    #[account(mut)]
    pub election_generator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(election_id:String, candidate_key:String)]
pub struct AddVote<'info> {
    #[account(
        mut,
        seeds=["candidate".as_bytes(), candidate_key.as_bytes(), election_id.as_bytes()],
        bump
    )]
    pub candidate: Account<'info, CandidateAccountState>,

    #[account(
        init,
        seeds=["vote".as_bytes(), election_id.as_bytes(), voter_signer.key().as_ref()],
        bump,
        payer=voter_signer,
        space=VoteAccount::INIT_SPACE + MAX_ELECTIONID_LENGTH + MAX_CANDIDATEKEY_LENGTH,
    )]
    pub voter: Account<'info, VoteAccount>,
    #[account(mut)]
    pub voter_signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl Space for CandidateAccountState {
    const INIT_SPACE: usize = ANCHOR_DISCRIMINATOR
        + STRING_LENGTH_PREFIX
        + STRING_LENGTH_PREFIX
        + STRING_LENGTH_PREFIX
        + STRING_LENGTH_PREFIX
        + U32_SIZE;
}

impl Space for ElectionAccountState {
    const INIT_SPACE: usize = ANCHOR_DISCRIMINATOR
        + PUBKEY_SIZE
        + STRING_LENGTH_PREFIX
        + STRING_LENGTH_PREFIX
        + STRING_LENGTH_PREFIX
        + BOOL_SIZE;
}

impl Space for VoteAccount {
    const INIT_SPACE: usize =
        ANCHOR_DISCRIMINATOR + PUBKEY_SIZE + STRING_LENGTH_PREFIX + PUBKEY_SIZE;
}
