use anchor_lang::prelude::*;

#[account]
pub struct ElectionAccountState {
    pub election_generator: Pubkey,
    pub election_id: String,
    pub election_title: String,
    pub election_description: String,
    pub is_active: bool,
}
