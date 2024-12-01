import { FC, useEffect, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { getPublicationAccounts, PublicationAccount } from '../utils/PublicationList';
import { PublicationItem } from './PublicationItem';

export const PublicationList: FC = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [publications, setPublications] = useState<PublicationAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchPublications = async () => {
    if (!wallet) return;
    
    setIsLoading(true);
    try {
      const publicationAccounts = await getPublicationAccounts(wallet, connection);
      setPublications(publicationAccounts);
    } catch (err) {
      console.error("Error fetching publications:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch publications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [wallet, connection]);

  return (
    <div className="publication-list-container">
      <h2>Publications</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="loading-state">Loading publications...</div>
      ) : publications.length === 0 ? (
        <div className="empty-state">
          <p>No publications found</p>
        </div>
      ) : (
        <div className="publications-content">
          <div className="publications-grid">
            {publications
            .sort((a, b) => a.timestamp - b.timestamp) // 按时间戳倒序排序
            .map((publication) => (
              <PublicationItem 
                key={publication.pubkey} 
                publication={publication}
              />
            ))}
          </div>
          
          <div className="publications-footer">
            <button 
              onClick={fetchPublications}
              disabled={isLoading}
              className="refresh-button"
            >
              {isLoading ? 'Loading...' : 'Refresh Publications'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};