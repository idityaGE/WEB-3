use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("6DzB2qXZhWod7n2AcZ94G7E2vyDiApKno1n4vBiyZpm3");

// stake
// unstake
// claim_reward

// Points rate: 1 point per SOL per day (1 point per 1e9 lamports per 86400 seconds)
const POINTS_PER_SOL_PER_DAY: u64 = 1_000_000; // Using micro-points for precision
const LAMPORTS_PER_SOL: u64 = 1_000_000_000;
const SECONDS_PER_DAY: u64 = 86_400;

#[program]
pub mod staking {

    use super::*;

    pub fn create_pda_account(ctx: Context<CreatePdaAccount>) -> Result<()> {
        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;

        pda_account.owner = ctx.accounts.payer.key();
        pda_account.bump = ctx.bumps.pda_account;
        pda_account.staked_amount = 0;
        pda_account.total_points = 0;
        pda_account.last_update_time = clock.unix_timestamp;

        Ok(())
    }

    pub fn stake(ctx: Context<StakeAccounts>, amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);

        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;

        update_points(pda_account, clock.unix_timestamp)?;

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: pda_account.to_account_info(),
            },
        );

        transfer(cpi_context, amount)?;

        pda_account.staked_amount = pda_account
            .staked_amount
            .checked_add(amount)
            .ok_or(StakeError::Overflow)?;

        msg!(
            "Staked {} lamports. Total staked: {}, Total points: {}",
            amount,
            pda_account.staked_amount,
            pda_account.total_points / 1_000_000
        );

        emit!(StakedEvent {
            staked_amount: amount,
            total_staked: pda_account.staked_amount,
            user: ctx.accounts.user.key()
        });

        Ok(())
    }

    pub fn unstake(ctx: Context<UnstakeAccounts>, amount: u64) -> Result<()> {
        require!(amount > 0, StakeError::InvalidAmount);

        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;

        require!(
            pda_account.staked_amount >= amount,
            StakeError::InsufficientStake
        );

        update_points(pda_account, clock.unix_timestamp)?;

        let user_key = ctx.accounts.user.key();
        let seeds = &[b"pda", user_key.as_ref(), &[pda_account.bump]];

        let signer = &[&seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: pda_account.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
            },
            signer,
        );

        transfer(cpi_context, amount)?;

        pda_account.staked_amount = pda_account
            .staked_amount
            .checked_sub(amount)
            .ok_or(StakeError::Underflow)?;

        msg!(
            "Unstaked {} lamports. Remaining staked: {}, Total points: {}",
            amount,
            pda_account.staked_amount,
            pda_account.total_points / 1_000_000
        );

        emit!(UnstakeEvent {
            unstaked_amount: amount,
            total_staked: pda_account.staked_amount,
            user: ctx.accounts.user.key()
        });

        Ok(())
    }

    pub fn claim_points(ctx: Context<ClaimReward>) -> Result<()> {
        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;

        update_points(pda_account, clock.unix_timestamp)?;

        let claimable_points = pda_account.total_points / 1_000_000;
        msg!("User has {} claimable points", claimable_points);

        pda_account.total_points = 0;

        emit!(ClaimPointsEvent {
            claimed_points: claimable_points,
            total_staked: pda_account.staked_amount,
            user: ctx.accounts.user.key()
        });

        Ok(())
    }

    pub fn get_points(ctx: Context<ClaimReward>) -> Result<()> {
        let pda_account = &mut ctx.accounts.pda_account;
        let clock = Clock::get()?;

        let time_elapsed = clock
            .unix_timestamp
            .checked_sub(pda_account.last_update_time)
            .ok_or(StakeError::Underflow)? as u64;
        let new_points = calculate_points_earned(pda_account.staked_amount, time_elapsed)?;

        let current_total_points = pda_account
            .total_points
            .checked_add(new_points)
            .ok_or(StakeError::Overflow)?;

        msg!(
            "Current points: {}, Staked amount: {} SOL",
            current_total_points / 1_000_000,
            pda_account.staked_amount / LAMPORTS_PER_SOL
        );

        Ok(())
    }
}

#[event]
pub struct StakedEvent {
    pub staked_amount: u64,
    pub total_staked: u64,
    pub user: Pubkey,
}

#[event]
pub struct UnstakeEvent {
    pub unstaked_amount: u64,
    pub total_staked: u64,
    pub user: Pubkey,
}

#[event]
pub struct ClaimPointsEvent {
    pub claimed_points: u64,
    pub total_staked: u64,
    pub user: Pubkey,
}

fn update_points(pda_account: &mut StakeAccount, current_time: i64) -> Result<()> {
    let time_elapsed = current_time
        .checked_sub(pda_account.last_update_time)
        .ok_or(StakeError::InvalidTimestamp)? as u64;

    if time_elapsed > 0 && pda_account.staked_amount > 0 {
        let new_point = calculate_points_earned(pda_account.staked_amount, time_elapsed)?;
        pda_account.total_points = pda_account
            .total_points
            .checked_add(new_point)
            .ok_or(StakeError::Overflow)?;
    }

    pda_account.last_update_time = current_time;
    Ok(())
}

fn calculate_points_earned(staked_amount: u64, time_elapsed: u64) -> Result<u64> {
    // Points = (staked_amount_in_sol * time_in_days * points_per_sol_per_day)
    // Using micro-points for precision to avoid floating point
    let points = (staked_amount as u128)
        .checked_mul(time_elapsed as u128)
        .ok_or(StakeError::Overflow)?
        .checked_mul(POINTS_PER_SOL_PER_DAY as u128)
        .ok_or(StakeError::Overflow)?
        .checked_div(LAMPORTS_PER_SOL as u128)
        .ok_or(StakeError::Overflow)?
        .checked_div(SECONDS_PER_DAY as u128)
        .ok_or(StakeError::Overflow)?;
    Ok(points as u64)
}

#[derive(Accounts)]
pub struct CreatePdaAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 8 + 8 + 8 + 1, // discriminator + owner + staked_amount + total_points + last_update_time + bump
        seeds = [b"pda", payer.key().as_ref()],
        bump
    )]
    pub pda_account: Account<'info, StakeAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeAccounts<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"pda", user.key().as_ref()],
        bump = pda_account.bump,
        constraint = pda_account.owner == user.key() @ StakeError::Unauthorized
    )]
    pub pda_account: Account<'info, StakeAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnstakeAccounts<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"pda", user.key().as_ref()],
        bump = pda_account.bump,
        constraint = pda_account.owner == user.key() @ StakeError::Unauthorized
    )]
    pub pda_account: Account<'info, StakeAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"pda", user.key().as_ref()],
        bump = pda_account.bump,
        constraint = pda_account.owner == user.key() @ StakeError::Unauthorized
    )]
    pub pda_account: Account<'info, StakeAccount>,
}

#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub staked_amount: u64,
    pub total_points: u64,
    pub last_update_time: i64,
    pub bump: u8,
}

#[error_code]
pub enum StakeError {
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("Insufficient staked amount")]
    InsufficientStake,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Arithmetic underflow")]
    Underflow,
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
}
