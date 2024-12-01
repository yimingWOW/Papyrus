use anchor_lang::prelude::*;

#[error_code]
pub enum PapyrusError {
    #[msg("Admin signature is required")]
    AdminSignatureRequired,
    #[msg("Title exceeds maximum length")]
    TitleTooLong,
    #[msg("Content reference exceeds maximum length")]
    ContentReferenceTooLong,
    #[msg("Content URI exceeds maximum length")]
    ContentUriTooLong,
    #[msg("Too many co-authors")]
    TooManyCoAuthors,
    #[msg("Too many references")]
    TooManyReferences,
    #[msg("Invalid reference")]
    InvalidReference,
    #[msg("Comment URI too long")]
    CommentUriTooLong,
    #[msg("Invalid score (must be between 0 and 50)")]
    InvalidScore,
    #[msg("Arithmetic overflow")]
    Overflow,
}
