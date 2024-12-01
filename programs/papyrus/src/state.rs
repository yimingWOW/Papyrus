use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Platform {
    /// The primary key of the Platform
    pub id: Pubkey,

    /// Account that has admin authority over the Platform
    pub admin: Pubkey,

    /// Current maximum publication ID (自增计数器)
    pub current_publication_id: u32,
}

impl Platform {
    pub const LEN: usize = 8 + 32 + 32 + 4;
}

#[account]
#[derive(Default)]
pub struct Publication {
    /// Primary key of the Platform
    pub platform: Pubkey,

    /// Unique identifier for the publication
    pub publication_id: u32,

    /// Title of the publication
    pub title: String,

    /// Author of the publication
    pub author: Pubkey, 

    /// Co-authors of the publication, the last one is the corresponding author
    pub co_authors: [Pubkey; 10],  

    /// Publication type (0: Paper, 1: Opinion, 2: Review, etc.)
    pub publication_type: u8,

    /// Content URI (IPFS hash or other storage reference)
    pub content_uri: String,

    /// References (直接存储引用的 publication_ids)
    pub references: [u32; 32],  // 使用较小的固定值

    /// Timestamp of publication
    pub timestamp: i64,
}

impl Publication {    
    pub const MAX_TITLE_LEN: usize = 200;
    pub const MAX_CONTENT_URI_LEN: usize = 100;
    pub const MAX_CO_AUTHORS: usize = 10;
    pub const MAX_REFERENCES: usize = 32;

    pub const LEN: usize = 8 +  // discriminator
        32 +    // platform
        4 +     // publication_id
        4 + Self::MAX_TITLE_LEN + // title
        32 +    // author
        (32 * 10) + // co_authors array
        1 +     // publication_type
        4 + Self::MAX_CONTENT_URI_LEN + // content_uri
        (4 * 32) + // references array
        8;      // timestamp
}


#[account]
#[derive(Default)]
pub struct Review {
    pub publication: Pubkey,    // 32
    pub reviewer: Pubkey,       // 32
    pub technical_score: u8,    // 1
    pub innovation_score: u8,   // 1
    pub presentation_score: u8, // 1
    pub overall_score: u8,      // 1
    pub comments_uri: String,   // 4 + 200
    pub timestamp: i64,         // 8
}

impl Review {
    pub const LEN: usize = 8 + 32 + 32 + 1 + 1 + 1 + 1 + (4 + 200) + 8;
    pub const MAX_COMMENTS_URI_LEN: usize = 200;
}