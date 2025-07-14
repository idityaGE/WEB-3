use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint:: ProgramResult,
    entrypoint,
    instruction::{AccountMeta, Instruction},
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let mut acc_iter = accounts.iter();
    let data_account = next_account_info(&mut acc_iter)?;
    let double_contract_add = next_account_info(&mut acc_iter)?;

    let instruction = Instruction {
        program_id: *double_contract_add.key,
        accounts: vec![AccountMeta{
            is_signer: data_account.is_signer,
            is_writable: data_account.is_writable,
            pubkey: *data_account.key
        }],
        data: vec![]
    };

    invoke(&instruction, &[data_account.clone()])?;

    Ok(())
}
