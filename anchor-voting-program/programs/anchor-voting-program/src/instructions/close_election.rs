use crate::{contexts::*, errors::*};
use anchor_lang::prelude::*;

pub fn close_election(ctx: Context<CloseElection>, _election_id: String) -> Result<()> {
    let election = &mut ctx.accounts.election;
    require!(
        election.is_active == true,
        CloseElectionError::ElectionClosedEarlier
    );

    election.is_active = false;
    msg!("Election closed successfully!");
    Ok(())
}
