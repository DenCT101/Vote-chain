use anchor_lang::prelude::*;

mod constants;
mod contexts;
mod errors;
mod instructions;
mod state;

use contexts::*;
use instructions::*;

// The `declare_id!` macro defines the unique program ID for this Solana program.
// This ID must match the one specified during deployment to ensure proper interaction.
declare_id!("7QFYjVpv8vsSyxuiuLcTPpErcNkVZ1Liag8F9K5tqhVD");

#[program]
pub mod anchor_voting_program {
    use super::*;

    pub fn create_election(
        ctx: Context<CreateElection>,
        election_id: String,
        election_title: String,
        election_description: String,
    ) -> Result<()> {
        instructions::create_election(ctx, election_id, election_title, election_description)
    }

    pub fn add_candidate(
        ctx: Context<AddCandidate>,
        candidate_key: String,
        election_id: String,
        candidate_name: String,
        candidate_slogan: String,
    ) -> Result<()> {
        instructions::add_candidate(
            ctx,
            candidate_key,
            election_id,
            candidate_name,
            candidate_slogan,
        )
    }

    pub fn add_vote(
        ctx: Context<AddVote>,
        election_id: String,
        candidate_key: String,
    ) -> Result<()> {
        instructions::add_vote(ctx, election_id, candidate_key)
    }

    pub fn close_election(ctx: Context<CloseElection>, election_id: String) -> Result<()> {
        instructions::close_election(ctx, election_id)
    }
}
