#![allow(unused_variables, unexpected_cfgs)]

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
#[derive(BorshDeserialize, BorshSerialize)]
struct OnChainData {
    count: i32,
}

entrypoint!(process_instruction);
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let mut acc_iter = accounts.iter();
    let data_account = next_account_info(&mut acc_iter)?;

    if data_account.is_signer != true {
        return Err(ProgramError::InvalidAccountData);
    }

    let mut counter = OnChainData::try_from_slice(&data_account.data.borrow_mut())?;

    if counter.count == 0 {
        counter.count = 1;
    } else {
        counter.count *= 2;
    }

    msg!("Counter : {}", counter.count);

    counter.serialize(&mut *data_account.data.borrow_mut())?;

    Ok(())
}
