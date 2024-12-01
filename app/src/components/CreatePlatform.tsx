import { FC, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { createPlatform } from '../utils/createPlatform';

export const CreatePlatformForm: FC = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastCreatedPlatform, setLastCreatedPlatform] = useState<{
    id: string;
    pda: string;
    signature: string;
  } | null>(null);

  const handleCreatePlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!wallet) {
      setError("Please connect your wallet first");
      setIsLoading(false);
      return;
    }

    try {
      // 生成一个新的随机公钥作为平台 ID
      const platformId = PublicKey.unique();
      
      const { signature, platformPda } = await createPlatform(
        wallet,
        connection,
        platformId
      );
      
      setLastCreatedPlatform({
        id: platformId.toString(),
        pda: platformPda.toString(),
        signature,
      });

      console.log('Platform created successfully!');
      console.log(`Transaction URL: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      console.log(`Platform ID: ${platformId.toString()}`);
      console.log(`Platform PDA: ${platformPda.toString()}`);
      
    } catch (err) {
      console.error("Error creating platform:", err);
      setError(err instanceof Error ? err.message : "Failed to create platform. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-platform-container">
      <h2>Create New Platform</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {lastCreatedPlatform && (
        <div className="success-message">
          <h3>Platform Created Successfully!</h3>
          <div>Platform ID: {lastCreatedPlatform.id}</div>
          <div>Platform PDA: {lastCreatedPlatform.pda}</div>
          <div>
            <a 
              href={`https://explorer.solana.com/tx/${lastCreatedPlatform.signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View transaction on Solana Explorer
            </a>
          </div>
        </div>
      )}

      <form onSubmit={handleCreatePlatform} className="form">
        <div className="form-description">
          <p>
            Creating a new platform will generate a unique platform ID and create 
            the corresponding account on the Solana blockchain.
          </p>
          <p>
            You will be set as the admin of this platform.
          </p>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading || !wallet}
        >
          {isLoading ? 'Creating Platform...' : 'Create Platform'}
        </button>
      </form>

      {!wallet && (
        <div className="wallet-notice">
          Please connect your wallet to create a platform
        </div>
      )}
    </div>
  );
};

export default CreatePlatformForm;