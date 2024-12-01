import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { PLATFORM_SEED, PUBLICATION_SEED } from './constants';
import papyrusIdl from '../idl/papyrus.json';

interface CreatePublicationParams {
  title: string;
  author: PublicKey;
  coAuthors: PublicKey[];
  publicationType: number;
  contentUri: string;
  references: number[];
  platformId: PublicKey;
}

export async function createPublication(
  wallet: any,
  connection: Connection,
  params: CreatePublicationParams,
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

    console.log('Finding Platform PDA');
    const [platformPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(PLATFORM_SEED),
        params.platformId.toBuffer(),
      ],
      program.programId
    );

    // 获取平台账户以获取当前出版物ID
    const platformAccount = await program.account.platform.fetch(platformPda);
    const nextPublicationId = platformAccount.currentPublicationId + 1;
        
    const [publicationPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(PUBLICATION_SEED),
        platformPda.toBuffer(),
        new anchor.BN(nextPublicationId).toArrayLike(Buffer, 'le', 4),  // 使用 4 字节
      ],
      program.programId
    );

    const paddedCoAuthors = [...params.coAuthors];
    while (paddedCoAuthors.length < 10) {
      paddedCoAuthors.push(PublicKey.default);
    }

    const paddedReferences = [...params.references];
    while (paddedReferences.length < 32) {
      paddedReferences.push(0);
    }

    console.log('Sending create publication transaction');
    const tx = await program.methods
      .createPublication(
        params.title,
        params.author,
        paddedCoAuthors,
        params.publicationType,
        params.contentUri,
        paddedReferences
      )
      .accounts({
        platform: platformPda,
        publication: publicationPda,
        payer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('Publication created successfully:', tx);
    return {
      signature: tx,
      publicationPda: publicationPda.toString(),
      platformPda: platformPda.toString(),
    };
  } catch (error) {
    console.error('Error creating publication:', error);
    throw error;
  }
}