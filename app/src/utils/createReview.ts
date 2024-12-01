import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { REVIEW_SEED } from './constants';
import papyrusIdl from '../idl/papyrus.json';

interface CreateReviewParams {
  publication: PublicKey;
  technicalScore: number;
  innovationScore: number;
  presentationScore: number;
  overallScore: number;
  commentsUri: string;
}

export async function createReview(
  wallet: any,
  connection: Connection,
  params: CreateReviewParams,
) {
  try {
    console.log('Creating provider');
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { preflightCommitment: "confirmed" }
    );

    console.log('Creating Program instance');
    const program = new anchor.Program(
      papyrusIdl,
      provider
    );

    console.log('Available methods:', Object.keys(program.methods));

    console.log('Finding Review PDA');
    const [reviewPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(REVIEW_SEED),
        params.publication.toBuffer(),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    console.log('Review PDA:', reviewPda.toString());

    console.log('Sending create review transaction');
    const tx = await program.methods
      .createReview(
        params.technicalScore,
        params.innovationScore,
        params.presentationScore,
        params.overallScore,
        params.commentsUri
      )
      .accounts({
        publication: params.publication,
        review: reviewPda,
        reviewer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('Review created successfully:', tx);
    
    return {
      signature: tx,
      reviewPda: reviewPda.toString(),
    };
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}