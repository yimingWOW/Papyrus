import { FC, useState } from 'react';
import { PublicationAccount } from '../utils/PublicationList';
import { ReviewList } from './ReviewList';
import { CreateReviewForm } from './CreateReviewForm';
import '../index.css';

const publicationTypes = [
  'Paper',
  'Opinion',
  'Review',
  'Other'
];

interface PublicationItemProps {
  publication: PublicationAccount;
}

export const PublicationItem: FC<PublicationItemProps> = ({ publication }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="publication-card">
      <div className="publication-header detail-row">
        <span className="detail-label">Title:</span>
        <span className="detail-value">
          {publication.title}
          <span className="publication-type">
            {publicationTypes[publication.publicationType]}
          </span>
        </span>
      </div>

      <div className="publication-details">
        <div className="detail-row">
          <span className="detail-label">ID:</span>
          <span className="detail-value">{publication.publicationId}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Platform:</span>
          <span className="detail-value" title={publication.platformId}>
            {publication.platformId}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Author:</span>
          <span className="detail-value" title={publication.author}>
            {publication.author}
          </span>
        </div>

        {publication.coAuthors.length > 0 && (
          <div className="detail-row">
            <span className="detail-label">Co-Authors:</span>
            <span className="detail-value">
              {publication.coAuthors.map((coAuthor, index) => (
                <>
                  <span key={index} title={coAuthor}>{coAuthor}</span>
                  {index < publication.coAuthors.length - 1 && ", "}
                </>
              ))}
            </span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Published:</span>
          <span className="detail-value">{formatDate(publication.timestamp)}</span>
        </div>

        {publication.references.length > 0 && (
          <div className="detail-row">
            <span className="detail-label">References:</span>
            <span className="detail-value">
              {publication.references.map((ref, index) => (
                <>
                  <span key={index}>#{ref}</span>
                  {index < publication.references.length - 1 && ", "}
                </>
              ))}
            </span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Content URI:</span>
          <a 
            href={publication.contentUri}
            target="_blank"
            rel="noopener noreferrer"
            className="content-link"
          >
            {publication.contentUri}
          </a>
        </div>
      </div>

      <div className="publication-actions">
        <a 
          href={publication.contentUri}
          target="_blank"
          rel="noopener noreferrer"
          className="view-content-button"
        >
          View Content
        </a>
        <button 
          onClick={() => {
            console.log("View details:", publication.pubkey);
          }}
          className="details-button"
        >
          Details
        </button>

        <button 
          onClick={() => {
            console.log("Write review:", publication.pubkey);
            setShowReviewForm(true);
          }}
          className="review-button"
        >
          Write Review
        </button>

      </div>

      <ReviewList publicationKey={publication.pubkey} />

      {showReviewForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Write a Review</h3>
              <button 
                onClick={() => setShowReviewForm(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            <CreateReviewForm 
              publicationKey={publication.pubkey}
              onSuccess={(signature) => {
                console.log('Review submitted:', signature);
                setShowReviewForm(false);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};