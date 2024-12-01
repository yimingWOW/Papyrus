use anchor_lang::prelude::*;

#[constant]
pub const MINIMUM_LIQUIDITY: u64 = 100;

#[constant]
pub const AUTHORITY_SEED: &[u8] = b"authority";

#[constant]
pub const PLATFORM_SEED: &[u8] = b"platform";

#[constant]
pub const PUBLICATION_SEED: &[u8] = b"publication";

#[constant]
pub const REVIEW_SEED: &[u8] = b"review";

