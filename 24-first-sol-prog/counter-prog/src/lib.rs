#![allow(unused_variables, unexpected_cfgs)]

use std::io::Error;
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

#[derive(BorshDeserialize, BorshSerialize)]
enum IntructionData {
    Increment(u32),
    Decrement(u32),
}

#[derive(BorshDeserialize, BorshSerialize)]
struct Counter {
    count: u32,
}

entrypoint!(counter_prog);
pub fn counter_prog(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // get first account details
    let acc: &AccountInfo<'_> = next_account_info(&mut accounts.iter())?;
    // borrow the acount details
    let mut acc_data: Counter = Counter::try_from_slice(&acc.data.borrow())?;

    let intruction_data: Result<IntructionData, Error> =
        IntructionData::try_from_slice(instruction_data);
    match intruction_data {
        Ok(intr_data) => match intr_data {
            IntructionData::Increment(val) => {
                acc_data.count += val;
            }
            IntructionData::Decrement(val) => {
                acc_data.count -= val;
            }
        },
        Err(e) => {
            msg!("Error BorshDeserialize : {e}")
        }
    }

    let res: Result<(), Error> = acc_data.serialize(&mut *acc.data.borrow_mut());
    match res {
        Ok(()) => msg!("Counter Updated"),
        Err(_) => msg!("Failed to update the data"),
    }

    Ok(())
}
