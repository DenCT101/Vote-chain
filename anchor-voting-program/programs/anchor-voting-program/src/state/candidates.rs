use anchor_lang::prelude::*;

#[account]
pub struct CandidateAccountState {
    pub election_id: String,
    pub candidate_key: String,
    pub candidate_name: String,
    pub candidate_slogan: String,
    pub vote_counts: u32,
}
