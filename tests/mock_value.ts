import * as anchor from '@coral-xyz/anchor';
import { type Connection, Keypair, PublicKey, type Signer } from '@solana/web3.js';

export interface TestValues {
  id: PublicKey;
  admin: Keypair;
  user: Keypair;

  platformKey: PublicKey;
  publicationKey: PublicKey;
}

type TestValuesDefaults = {
  [K in keyof TestValues]+?: TestValues[K];
};
export function createValues(defaults?: TestValuesDefaults): TestValues {
  const id = defaults?.id || Keypair.generate().publicKey;
  const admin = Keypair.generate();

  const user = Keypair.generate();

  const platformKey = PublicKey.findProgramAddressSync(
    [Buffer.from('platform'), id.toBuffer()],
    anchor.workspace.Papyrus.programId
  )[0];

  const publicationKey = PublicKey.findProgramAddressSync(
    [Buffer.from('publication'), platformKey.toBuffer(), Buffer.from('1')],
    anchor.workspace.Papyrus.programId
  )[0];

  return {
    id,
    admin,
    user,
    platformKey,
    publicationKey
  };
}