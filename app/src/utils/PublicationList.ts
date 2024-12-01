import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from '@coral-xyz/anchor';
import papyrusIdl from '../idl/papyrus.json';

export interface PublicationAccount {
  pubkey: string;
  platformId: string;
  publicationId: number;
  title: string;
  author: string;
  coAuthors: string[];
  publicationType: number;
  contentUri: string;
  references: number[];
  timestamp: number;
}

export const getPublicationAccounts = async (
  wallet: AnchorWallet,
  connection: Connection
): Promise<PublicationAccount[]> => {
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { preflightCommitment: "confirmed" }
  );

  const program = new anchor.Program(
    papyrusIdl,
    provider
  );

  // 获取所有论文账户
  const accounts = await program.account.publication.all();
  
  return accounts.map(account => ({
    pubkey: account.publicKey.toString(),
    platformId: account.account.platform.toString(),
    publicationId: account.account.publicationId,
    title: account.account.title,
    author: account.account.author.toString(),
    coAuthors: account.account.coAuthors
      .filter(author => !author.equals(PublicKey.default)) // 过滤掉默认值
      .map(author => author.toString()),
    publicationType: account.account.publicationType,
    contentUri: account.account.contentUri,
    references: account.account.references
      .filter(ref => ref !== 0), // 过滤掉默认值
    timestamp: account.account.timestamp,
  }));
};