import { FC, useEffect, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { getPlatformAccounts } from '../utils/platformList';

interface PlatformInfo {
  pubkey: string;
  id: string;
  admin: string;
  currentPublicationId: number;
}

export const PlatformList: FC = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [platforms, setPlatforms] = useState<PlatformInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchPlatforms = async () => {
    if (!wallet) return;
    
    setIsLoading(true);
    try {
      const platformAccounts = await getPlatformAccounts(wallet, connection);
      setPlatforms(platformAccounts);
    } catch (err) {
      console.error("Error fetching platforms:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch platforms");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, [wallet, connection]);

  return (
    <div className="create-platform-container">
      <h2>Your Platforms</h2>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div>Loading platforms...</div>
      ) : platforms.length === 0 ? (
        <div className="form-group">
          <p>No platforms found</p>
        </div>
      ) : (
        <div className="form-group">
          {platforms.map((platform) => (
            <div key={platform.pubkey} className="platform-item">
              <div className="platform-details">
                <span className="platform-label">Platform ID:</span>
                <span className="platform-value">{platform.id}</span>
              </div>
              <div className="platform-details">
                <span className="platform-label">Admin:</span>
                <span className="platform-value">{platform.admin}</span>
              </div>
              <div className="platform-details">
                <span className="platform-label">Publications:</span>
                <span className="platform-value">{platform.currentPublicationId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <button 
        onClick={fetchPlatforms}
        disabled={isLoading}
        className="refresh-button"
      >
        {isLoading ? 'Loading...' : 'Refresh Platforms'}
      </button>
    </div>
  );
};

export default PlatformList;