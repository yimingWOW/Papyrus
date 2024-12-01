import * as anchor from '@coral-xyz/anchor';
import type { Program } from '@coral-xyz/anchor';
import { expect } from 'chai';
import type { Papyrus } from '../target/types/papyrus';

import { type TestValues, createValues } from './mock_value';

// 测试 Platform（自动做市商）的创建功能
describe('Create Platform', () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.Papyrus as Program<Papyrus>;

  let values: TestValues;

  beforeEach(() => {
    values = createValues();
  });

  // 1. 正常创建 Platform
  it('Creation', async () => {
    // 创建 Platform 并验证账户信息是否正确
    await program.methods.createPlatform(values.id).accounts({
      platform: values.platformKey,
      admin: values.admin.publicKey 
    }).rpc();

    const platformAccount = await program.account.platform.fetch(values.platformKey);
    expect(platformAccount.id.toString()).to.equal(values.id.toString());
    expect(platformAccount.admin.toString()).to.equal(values.admin.publicKey.toString());
  });
});