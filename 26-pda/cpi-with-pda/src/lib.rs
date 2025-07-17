use borsh::BorshDeserialize;
use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, program::invoke_signed,
    program_error::ProgramError, pubkey::Pubkey, system_instruction,
};

entrypoint!(process_instruction);

#[derive(BorshDeserialize)]
enum ProgramInstruction {
    SolTransfer { amount: u64 },
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
        ProgramInstruction::SolTransfer { amount } => {
            let [pda_account_info, recipient_info, system_program_info] = accounts else {
                return Err(ProgramError::AccountDataTooSmall);
            };
            let seeds = &[b"pda", recipient_info.key.as_ref()];
            let (expected_pda, pda_bumps) = Pubkey::find_program_address(seeds, program_id);
            if expected_pda != *pda_account_info.key {
                return Err(ProgramError::InvalidArgument);
            }
            let ix = system_instruction::transfer(pda_account_info.key, recipient_info.key, amount);
            // why its a 3d array ? becaz it can hold for multiple pda seeds
            // why I am adding the [pda_bumps] at the end ? -> When processing an instruction that includes a CPI,
            // the Solana runtime internally calls `create_program_address` using the signers_seeds and the program_id of the calling program.
            // When a valid PDA verified, the address is added as a valid signer.
            // It use create_program_address which use doesn't check weather the derived pda is off the curve,
            // to make sure it get the right pda_address we need to add the [pda_bumps] mannualy.
            // for more information read docs/core/cpi
            let signer_seed: &[&[&[u8]]] = &[&[b"pda", recipient_info.key.as_ref(), &[pda_bumps]]];

            invoke_signed(
                &ix,
                &[
                    pda_account_info.clone(),
                    recipient_info.clone(),
                    system_program_info.clone(),
                ],
                signer_seed,
            )?;
        }
    }
    Ok(())
}
