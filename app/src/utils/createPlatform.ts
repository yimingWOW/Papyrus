import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import papyrusIdl from '../idl/papyrus.json';
import { PLATFORM_SEED } from './constants';

export async function createPlatform(
  wallet: any,
  connection: Connection,
  platformId: PublicKey,
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

    console.log('Finding Platform PDA');
    const [platformPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(PLATFORM_SEED),
        platformId.toBuffer(),
      ],
      program.programId
    );

    console.log('Sending create platform transaction');
    const tx = await program.methods
      .createPlatform(platformId)
      .accounts({
        platform: platformPda,
        admin: provider.wallet.publicKey,
        payer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('Platform created successfully:', tx);
    return {
      signature: tx,
      platformPda,
    };
  } catch (error) {
    console.error('Error creating platform:', error);
    throw error;
  }
}