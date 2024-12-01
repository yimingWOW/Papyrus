import { FC, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { createReview } from '../utils/createReview';

interface CreateReviewFormProps {
  publicationKey: string;
  onSuccess?: (signature: string) => void;
}

export const CreateReviewForm: FC<CreateReviewFormProps> = ({ 
  publicationKey,
  onSuccess 
}) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState({
    technicalScore: 0,
    innovationScore: 0,
    presentationScore: 0,
    overallScore: 0,
    commentsUri: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;

    setIsSubmitting(true);
    setError("");

    try {
      const result = await createReview(
        wallet,
        connection,
        {
          publication: new PublicKey(publicationKey),
          ...formData,
        }
      );

      console.log('Review created:', result);
      onSuccess?.(result.signature);
      
      // 重置表单
      setFormData({
        technicalScore: 0,
        innovationScore: 0,
        presentationScore: 0,
        overallScore: 0,
        commentsUri: '',
      });
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err instanceof Error ? err.message : 'Failed to create review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let numValue = parseInt(value);
    
    // 验证分数范围
    if (name.includes('Score')) {
      numValue = Math.min(Math.max(numValue, 0), 50);
    }

    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Score') ? numValue : value,
    }));
  };

  if (!wallet) {
    return <div>Please connect your wallet to submit a review</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="form-group">
        <label>Technical Score (0-50):</label>
        <input
          type="number"
          name="technicalScore"
          value={formData.technicalScore}
          onChange={handleInputChange}
          min="0"
          max="50"
          required
        />
      </div>

      <div className="form-group">
        <label>Innovation Score (0-50):</label>
        <input
          type="number"
          name="innovationScore"
          value={formData.innovationScore}
          onChange={handleInputChange}
          min="0"
          max="50"
          required
        />
      </div>

      <div className="form-group">
        <label>Presentation Score (0-50):</label>
        <input
          type="number"
          name="presentationScore"
          value={formData.presentationScore}
          onChange={handleInputChange}
          min="0"
          max="50"
          required
        />
      </div>

      <div className="form-group">
        <label>Overall Score (0-50):</label>
        <input
          type="number"
          name="overallScore"
          value={formData.overallScore}
          onChange={handleInputChange}
          min="0"
          max="50"
          required
        />
      </div>

      <div className="form-group">
        <label>Comments URI:</label>
        <input
          type="text"
          name="commentsUri"
          value={formData.commentsUri}
          onChange={handleInputChange}
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};