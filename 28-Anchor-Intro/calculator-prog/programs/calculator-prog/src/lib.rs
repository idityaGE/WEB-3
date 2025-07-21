use anchor_lang::prelude::*;
declare_id!("HvFzpHsbeSs8F7UyRCGknS9JiGNHgyohsL54JBwcdzAh");

#[program]
pub mod calculator_prog {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, count: u32) -> Result<()> {
        ctx.accounts.data_account.count = count;
        Ok(())
    }

    pub fn double(ctx: Context<Acc>) -> Result<()> {
        ctx.accounts.data_account.count = ctx.accounts.data_account.count.saturating_mul(2);
        Ok(())
    }
    pub fn half(ctx: Context<Acc>) -> Result<()> {
        ctx.accounts.data_account.count /= 2;
        Ok(())
    }
    pub fn add(ctx: Context<Acc>, data: u32) -> Result<()> {
        ctx.accounts.data_account.count = ctx.accounts.data_account.count.saturating_add(data);
        Ok(())
    }
    pub fn subs(ctx: Context<Acc>, data: u32) -> Result<()> {
        ctx.accounts.data_account.count = ctx.accounts.data_account.count.saturating_sub(data);
        Ok(())
    }
}

#[account]
pub struct DataAccount {
    count: u32,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 4)]
    pub data_account: Account<'info, DataAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Acc<'info> {
    pub data_account: Account<'info, DataAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
}
