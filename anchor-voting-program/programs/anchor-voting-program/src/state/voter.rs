use anchor_lang::prelude::*;

#[account]
pub struct VoteAccount {
    pub voter: Pubkey,
    pub election_id: String,
    pub candidate_key: String,
}
