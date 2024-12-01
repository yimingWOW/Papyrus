use anchor_lang::prelude::*;
use crate::{constants::*, errors::*, state::*};

pub fn create_review(
    ctx: Context<CreateReview>,
    technical_score: u8,
    innovation_score: u8,
    presentation_score: u8,
    overall_score: u8,
    comments_uri: String,
) -> Result<()> {
    let publication = &mut ctx.accounts.publication;
    let review = &mut ctx.accounts.review;
    
    // 验证参数
    require!(
        comments_uri.len() <= Review::MAX_COMMENTS_URI_LEN,
        PapyrusError::CommentUriTooLong
    );
    require!(
        technical_score <= 50 && 
        innovation_score <= 50 && 
        presentation_score <= 50 && 
        overall_score <= 50,
        PapyrusError::InvalidScore
    );
    
    // 初始化 Review
    review.publication = publication.key();
    review.reviewer = ctx.accounts.reviewer.key();
    review.technical_score = technical_score;
    review.innovation_score = innovation_score;
    review.presentation_score = presentation_score;
    review.overall_score = overall_score;
    review.comments_uri = comments_uri;
    review.timestamp = Clock::get()?.unix_timestamp;

    msg!(
        "Review created for publication: {}, reviewer: {}, score: {}", 
        publication.key(), 
        ctx.accounts.reviewer.key(),
        overall_score
    );
    Ok(())
}

#[derive(Accounts)]
#[instruction(
    technical_score: u8,
    innovation_score: u8,
    presentation_score: u8,
    overall_score: u8,
    comments_uri: String,
)]
pub struct CreateReview<'info> {
    #[account(mut)]
    pub publication: Account<'info, Publication>,

    #[account(
        init,
        payer = reviewer,
        space = Review::LEN,
        seeds = [
            REVIEW_SEED,
            publication.key().as_ref(),
            reviewer.key().as_ref(),
        ],
        bump,
    )]
    pub review: Account<'info, Review>,

    #[account(mut)]
    pub reviewer: Signer<'info>,

    pub system_program: Program<'info, System>,
}