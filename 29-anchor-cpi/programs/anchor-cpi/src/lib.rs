use anchor_lang::prelude::*;
use anchor_lang::solana_program::{instruction::Instruction, program::invoke, system_instruction};
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("hVePXvKgG56t7LXDDCFzLLSEKgxqU3gimWnEhsnxHP1");

#[program]
pub mod anchor_cpi {
    use super::*;

    /// Example 1: Uses Anchor's CpiContext and helper function to construct the CPI instruction.
    pub fn sol_transfer_cpi_context(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.sender.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let cpi_context = CpiContext::new(
            program_id,
            Transfer {
                from: from_pubkey,
                to: to_pubkey,
            },
        );

        transfer(cpi_context, amount)?;
        Ok(())
    }

    /// Example 2: Uses the system_instruction::transfer function from the solana_program crate to construct the CPI instruction. Example 1 abstracts this implementation.
    pub fn sol_tranfer_system_instruction(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.sender.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

        let instruction = &system_instruction::transfer(&from_pubkey.key, &to_pubkey.key, amount);
        invoke(instruction, &[from_pubkey, to_pubkey, program_id])?;
        Ok(())
    }

    /// Example 3: Constructs the CPI instruction manually. This approach is useful when no crate exists to help build the instruction.
    pub fn sol_tranfer_manually(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        let from_pubkey = ctx.accounts.sender.to_account_info();
        let to_pubkey = ctx.accounts.recipient.to_account_info();
        let program_id = ctx.accounts.system_program.to_account_info();

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

        invoke(&instruction, &[from_pubkey, to_pubkey, program_id])?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    sender: Signer<'info>,
    #[account(mut)]
    recipient: SystemAccount<'info>,
    system_program: Program<'info, System>,
}
