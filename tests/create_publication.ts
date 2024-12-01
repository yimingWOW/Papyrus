import * as anchor from '@coral-xyz/anchor';
import type { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { expect } from 'chai';
import type { Papyrus } from '../target/types/papyrus';
import { type TestValues, createValues } from './mock_value';

describe('Create Publication', () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.Papyrus as Program<Papyrus>;

  let values: TestValues;

  beforeEach(async () => {
    values = createValues();

    // 首先创建一个平台
    await program.methods.createPlatform(values.id)
      .accounts({
        platform: values.platformKey,
        admin: provider.wallet.publicKey,
      })
      .rpc();
  });

  it('Successfully creates a publication', async () => {
    const title = "Test Publication";
    const contentUri = "https://example.com/content";
    const publicationType = 0;
    const coAuthors: PublicKey[] = [];
    const references: number[] = [];

    // 获取平台账户以获取当前出版物ID
    const platformAccount = await program.account.platform.fetch(values.platformKey);
    const nextPublicationId = platformAccount.currentPublicationId + 1;

    console.log('Platform Account:', {
        key: values.platformKey.toString(),
        currentPublicationId: platformAccount.currentPublicationId,
      });

    // 计算 publication PDA
    const [publicationPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("publication"),
        values.platformKey.toBuffer(),
        new anchor.BN(nextPublicationId).toArrayLike(Buffer, 'le', 4),  // 使用 4 字节
      ],
      program.programId
    );

    console.log('PDA Calculation Details:', {
        publicationSeed: 'publication',
        platformKey: values.platformKey.toString(),
        nextPublicationId,
        publicationIdBytes: Array.from(new anchor.BN(nextPublicationId).toArrayLike(Buffer, 'le', 8)),
        programId: program.programId.toString(),
        resultPda: publicationPda.toString()
      });

    
    await program.methods.createPublication(
      title,
      provider.wallet.publicKey,  // author
      coAuthors,
      publicationType,
      contentUri,
      references
    )
    .accounts({
      platform: values.platformKey,
      publication: publicationPda,
    })
    .rpc();

    // 验证发布内容
    const publicationAccount = await program.account.publication.fetch(publicationPda);
    expect(publicationAccount.title).to.equal(title);
    expect(publicationAccount.author.toString()).to.equal(provider.wallet.publicKey.toString());
    expect(publicationAccount.contentUri).to.equal(contentUri);
    expect(publicationAccount.publicationType).to.equal(publicationType);
    expect(publicationAccount.platform.toString()).to.equal(values.platformKey.toString());
  });
});