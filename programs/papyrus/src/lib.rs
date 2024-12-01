#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

mod constants;
mod errors;
mod instructions;
mod state;

declare_id!("9EG2q4GnVK9dYDcsMi4vdjdsQCAMvpXcG8npb2KNV2os");

#[program]
pub mod papyrus {
    pub use super::instructions::*;
    use super::*;

    pub fn create_platform(ctx: Context<CreatePlatform>, id: Pubkey) -> Result<()> {
        instructions::create_platform(ctx, id)
    }

    pub fn create_publication(ctx: Context<CreatePublication>, title: String, author: Pubkey, co_authors: Vec<Pubkey>, publication_type: u8, content_uri: String, references: Vec<u32>) -> Result<()> {
        instructions::create_publication(ctx, title, author, co_authors, publication_type, content_uri, references)
    }

    pub fn create_review(ctx: Context<CreateReview>, technical_score: u8, innovation_score: u8, presentation_score: u8, overall_score: u8, comments_uri: String) -> Result<()> {
        instructions::create_review(ctx, technical_score, innovation_score, presentation_score, overall_score, comments_uri)
    }
}
