use anchor_lang::prelude::*;

use crate::{constants::PLATFORM_SEED, errors::*, state::Platform};

pub fn create_platform(ctx: Context<CreatePlatform>, id: Pubkey) -> Result<()> {
    let platform = &mut ctx.accounts.platform;
    platform.id = id;
    platform.admin = ctx.accounts.admin.key();

    Ok(())
}

#[derive(Accounts)]
#[instruction(id: Pubkey)]
pub struct CreatePlatform<'info> {
    #[account(
        init,
        payer = payer,
        space = Platform::LEN,
        seeds = [
            PLATFORM_SEED,
            id.as_ref()
        ],
        bump,
    )]
    pub platform: Account<'info, Platform>,

    /// The admin of the AMM
    /// CHECK: Read only, delegatable creation
    pub admin: AccountInfo<'info>,

    /// The account paying for all rents
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Solana ecosystem accounts
    pub system_program: Program<'info, System>,
}
