import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from '@coral-xyz/anchor';
import papyrusIdl from '../idl/papyrus.json';

export interface PlatformAccount {
  pubkey: string;
  id: string;
  admin: string;
  currentPublicationId: number;
}

export const getPlatformAccounts = async (
  wallet: AnchorWallet,
  connection: Connection
): Promise<PlatformAccount[]> => {
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { preflightCommitment: "confirmed" }
  );

  const program = new anchor.Program(
    papyrusIdl,
    provider
  );

  // 获取所有平台账户
  const accounts = await program.account.platform.all();
  
  return accounts.map(account => ({
    pubkey: account.publicKey.toString(),
    id: account.account.id.toString(),
    admin: account.account.admin.toString(),
    currentPublicationId: account.account.currentPublicationId,
  }));
};