use anchor_lang::prelude::*;

declare_id!("6DzB2qXZhWod7n2AcZ94G7E2vyDiApKno1n4vBiyZpm3");

// stake
// unstake
// claim_reward

#[program]
pub mod staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
