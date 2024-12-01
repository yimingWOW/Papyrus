import { FC, useEffect, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { getReviews, ReviewAccount, calculateAverageScores } from '../utils/getReviews';

interface ReviewListProps {
  publicationKey: string;
}

export const ReviewList: FC<ReviewListProps> = ({ publicationKey }) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [reviews, setReviews] = useState<ReviewAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchReviews = async () => {
    if (!wallet) return;
    
    setIsLoading(true);
    try {
      const reviewAccounts = await getReviews(wallet, connection, publicationKey);
      setReviews(reviewAccounts);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [wallet, connection, publicationKey]);

  const averageScores = calculateAverageScores(reviews);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="reviews-container">
      <h3>Reviews ({reviews.length})</h3>
      
      {averageScores && (
        <div className="average-scores">
          <h4>Average Scores</h4>
          <div className="scores-grid">
            <div>Technical: {averageScores.technicalScore.toFixed(1)}</div>
            <div>Innovation: {averageScores.innovationScore.toFixed(1)}</div>
            <div>Presentation: {averageScores.presentationScore.toFixed(1)}</div>
            <div>Overall: {averageScores.overallScore.toFixed(1)}</div>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">No reviews yet</div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.pubkey} className="review-card">
              <div className="review-header">
                <span className="reviewer">{review.reviewer}</span>
                <span className="date">{formatDate(review.timestamp)}</span>
              </div>
              
              <div className="scores">
                <div>Technical: {review.technicalScore.toFixed(1)}</div>
                <div>Innovation: {review.innovationScore.toFixed(1)}</div>
                <div>Presentation: {review.presentationScore.toFixed(1)}</div>
                <div>Overall: {review.overallScore.toFixed(1)}</div>
              </div>

              <a 
                href={review.commentsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="comments-link"
              >
                View Comments
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};