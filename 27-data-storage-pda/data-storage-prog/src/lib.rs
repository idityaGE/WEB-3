use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};

entrypoint!(process_instruction);

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserData {
    pub name: String,
    pub age: u8,
    pub email: String,
    pub created_at: i64,
}

impl UserData {
    pub const MAX_SIZE: usize = 4 + 32 + // name (4 bytes length + 32 chars max)
        1 +      // age (u8)
        4 + 64 + // email (4 bytes length + 64 chars max) 
        8; // created_at (i64)
}

#[derive(BorshDeserialize)]
pub enum ProgramInstruction {
    CreateUserAccount {
        name: String,
        age: u8,
        email: String,
    },
    UpdateUserData {
        name: Option<String>,
        age: Option<u8>,
        email: Option<String>,
    },
}

impl ProgramInstruction {
    fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        Self::try_from_slice(input).map_err(|_| ProgramError::InvalidInstructionData)
    }
}

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = ProgramInstruction::unpack(instruction_data)?;

    match instruction {
        ProgramInstruction::CreateUserAccount { name, age, email } => {
            create_user_account(program_id, accounts, name, age, email)
        }
        ProgramInstruction::UpdateUserData { name, age, email } => {
            update_user_data(program_id, accounts, name, age, email)
        }
    }
}

fn create_user_account(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    name: String,
    age: u8,
    email: String,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user_info = next_account_info(account_info_iter)?; // User paying for account
    let user_data_account = next_account_info(account_info_iter)?; // PDA to store data
    let system_program = next_account_info(account_info_iter)?; // System program

    // Verify user is signer
    if !user_info.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Derive PDA for user data storage
    let seeds = &[b"user_data", user_info.key.as_ref()];
    let (expected_pda, bump) = Pubkey::find_program_address(seeds, program_id);

    // Verify provided PDA matches expected
    if expected_pda != *user_data_account.key {
        msg!(
            "Expected PDA: {}, Got: {}",
            expected_pda,
            user_data_account.key
        );
        return Err(ProgramError::InvalidArgument);
    }

    // Check if account already exists
    if user_data_account.data_len() > 0 {
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    // Calculate rent for account
    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(UserData::MAX_SIZE);

    // Create the PDA account
    let create_account_ix = system_instruction::create_account(
        user_info.key,             // Payer
        user_data_account.key,     // New account (PDA)
        required_lamports,         // Lamports to transfer
        UserData::MAX_SIZE as u64, // Space to allocate
        program_id,                // Owner of the new account
    );

    // Sign with PDA seeds
    let signer_seeds: &[&[&[u8]]] = &[&[b"user_data", user_info.key.as_ref(), &[bump]]];

    invoke_signed(
        &create_account_ix,
        &[
            user_info.clone(),
            user_data_account.clone(),
            system_program.clone(),
        ],
        signer_seeds,
    )?;

    // Initialize account data
    let user_data = UserData {
        name,
        age,
        email,
        created_at: solana_program::clock::Clock::get()?.unix_timestamp,
    };

    // Serialize and store data
    user_data.serialize(&mut &mut user_data_account.data.borrow_mut()[..])?;

    msg!("User account created successfully for: {}", user_info.key);
    Ok(())
}

fn update_user_data(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    name: Option<String>,
    age: Option<u8>,
    email: Option<String>,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user_info = next_account_info(account_info_iter)?;
    let user_data_account = next_account_info(account_info_iter)?;

    // Verify user is signer
    if !user_info.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let seeds = &[b"user_data", user_info.key.as_ref()];
    let (expected_pda, _) = Pubkey::find_program_address(seeds, program_id);

    // Verify provided PDA matches expected
    if expected_pda != *user_data_account.key {
        msg!(
            "Expected PDA: {}, Got: {}",
            expected_pda,
            user_data_account.key
        );
        return Err(ProgramError::InvalidArgument);
    }

    // Verify account ownership
    if user_data_account.owner != &solana_program::system_program::ID {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize existing data
    let mut user_data = UserData::try_from_slice(&user_data_account.data.borrow())?;

    // Update fields if provided
    if let Some(new_name) = name {
        user_data.name = new_name;
    }
    if let Some(new_age) = age {
        user_data.age = new_age;
    }
    if let Some(new_email) = email {
        user_data.email = new_email;
    }

    // Serialize updated data back to account
    user_data.serialize(&mut &mut user_data_account.data.borrow_mut()[..])?;

    msg!("User data updated for: {}", user_info.key);
    Ok(())
}
