use anchor_lang::prelude::*;
use crate::{constants::*, errors::*, state::*};

pub fn create_publication(
    ctx: Context<CreatePublication>,
    title: String,
    author: Pubkey,
    co_authors: Vec<Pubkey>,
    publication_type: u8,
    content_uri: String,
    references: Vec<u32>,
) -> Result<()> {
    let platform = &mut ctx.accounts.platform;
    let publication = &mut ctx.accounts.publication;
    
    // 验证参数
    require!(
        title.len() <= Publication::MAX_TITLE_LEN,
        PapyrusError::TitleTooLong
    );
    require!(
        content_uri.len() <= Publication::MAX_CONTENT_URI_LEN,
        PapyrusError::ContentUriTooLong
    );
    require!(
        co_authors.len() <= 10,
        PapyrusError::TooManyCoAuthors
    );
    require!(
        references.len() <= 32,
        PapyrusError::TooManyReferences
    );
    
    // 获取并递增 publication_id
    platform.current_publication_id += 1;
    let publication_id = platform.current_publication_id;
    
    // 初始化 Publication
    publication.platform = platform.key();
    publication.publication_id = publication_id;
    publication.title = title;
    publication.author = author;
    publication.publication_type = publication_type;
    publication.content_uri = content_uri;
    
    // 初始化 co_authors 数组
    publication.co_authors = [Pubkey::default(); 10];
    for (i, co_author) in co_authors.iter().enumerate() {
        publication.co_authors[i] = *co_author;
    }
    
    // 初始化 references 数组
    publication.references = [0u32; 32];
    for (i, reference) in references.iter().enumerate() {
        // 可以添加验证，确保引用的论文存在
        require!(
            *reference <= platform.current_publication_id,
            PapyrusError::InvalidReference
        );
        publication.references[i] = *reference;
    }
    
    publication.timestamp = Clock::get()?.unix_timestamp;

    msg!("Publication created with ID: {} for author: {}", publication_id, author);
    Ok(())
}

#[derive(Accounts)]
#[instruction(
    title: String,
    author: Pubkey,
    co_authors: Vec<Pubkey>,
    publication_type: u8,
    content_uri: String,
    references: Vec<u32>,
)]
pub struct CreatePublication<'info> {
    #[account(
        mut,
        seeds = [
            PLATFORM_SEED,
            platform.id.as_ref()
        ],
        bump,
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        init,
        payer = payer,
        space = Publication::LEN,
        seeds = [
            PUBLICATION_SEED,
            platform.key().as_ref(),
            &(platform.current_publication_id + 1).to_le_bytes(),  // 直接计算，更简洁
        ],
        bump,
    )]
    pub publication: Account<'info, Publication>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}