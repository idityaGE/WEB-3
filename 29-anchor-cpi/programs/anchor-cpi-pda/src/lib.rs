use anchor_lang::prelude::*;
use anchor_lang::solana_program::{instruction::Instruction, system_instruction};
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("Gx8jFR1hW3tBoxdXBsvoaD62KNGJ1SVkS5kXxskeJQ6S");

#[program]
pub mod anchor_cpi {
    use anchor_lang::solana_program::program::invoke_signed;

    use super::*;

    /// Example 1: Uses Anchor's CpiContext and helper function to construct the CPI instruction.
    pub fn sol_transfer_cpi_context(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.pda_account.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let seed = to_pubkey.key();
        let bump_seed = ctx.bumps.pda_account;
        let signer_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

        let cpi_context = CpiContext::new(
            program_id,
            Transfer {
                from: from_pubkey,
                to: to_pubkey,
            },
        )
        .with_signer(signer_seeds);

        transfer(cpi_context, amount)?;
        Ok(())
    }

    /// Example 2: Uses the system_instruction::transfer function from the solana_program crate to construct the CPI instruction. Example 1 abstracts this implementation.
    pub fn sol_tranfer_system_instruction(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.pda_account.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let seed = to_pubkey.key();
        let bump_seed = ctx.bumps.pda_account;
        let signers_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

        let instruction = &system_instruction::transfer(&from_pubkey.key, &to_pubkey.key, amount);

        invoke_signed(
            instruction,
            &[from_pubkey, to_pubkey, program_id],
            signers_seeds,
        )?;

        Ok(())
    }

    /// Example 3: Constructs the CPI instruction manually. This approach is useful when no crate exists to help build the instruction.
    pub fn sol_tranfer_manually(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.pda_account.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let seed = to_pubkey.key();
        let bump_seed = ctx.bumps.pda_account;
        let signers_seeds: &[&[&[u8]]] = &[&[b"pda", seed.as_ref(), &[bump_seed]]];

        let account_metas = vec![
            AccountMeta::new(from_pubkey.key(), true),
            AccountMeta::new(to_pubkey.key(), false),
        ];

        let instruction_discriminator: u32 = 2; // trnasfer discrimintor is 2
        let mut instruction_data = Vec::with_capacity(4 + 8); // 4 => instruction type (transfer) + 8 => amount (lamports)
        instruction_data.extend_from_slice(&instruction_discriminator.to_le_bytes()); // little endian (from left side)
        instruction_data.extend_from_slice(&amount.to_le_bytes());

        let instruction = Instruction {
            program_id: program_id.key(),
            accounts: account_metas,
            data: instruction_data,
        };

        invoke_signed(
            &instruction,
            &[from_pubkey, to_pubkey, program_id],
            signers_seeds,
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        mut,
        seeds = [b"pda", recipient.key().as_ref()],
        bump
    )]
    pda_account: Signer<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
