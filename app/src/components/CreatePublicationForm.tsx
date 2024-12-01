import { FC, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { createPublication } from '../utils/createPublication';

interface FormData {
  title: string;
  author: string;
  coAuthors: string;
  publicationType: string;
  contentUri: string;
  references: string;
  platformId: string;
}

export const CreatePublicationForm: FC = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    author: '',
    coAuthors: '',
    publicationType: '0',
    contentUri: '',
    references: '',
    platformId: '',
  });

  const [lastCreatedPublication, setLastCreatedPublication] = useState<{
    signature: string;
    publicationPda: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!wallet) {
      setError("Please connect your wallet first");
      setIsLoading(false);
      return;
    }

    try {
      // 验证输入
      if (!formData.title || !formData.author || !formData.contentUri || !formData.platformId) {
        throw new Error("Please fill in all required fields");
      }

      // 处理共同作者列表
      const coAuthors = formData.coAuthors
        ? formData.coAuthors.split(',').map(addr => new PublicKey(addr.trim()))
        : [];

      // 处理引用列表
      const references = formData.references
        ? formData.references.split(',').map(ref => parseInt(ref.trim()))
        : [];

      const { signature, publicationPda } = await createPublication(
        wallet,
        connection,
        {
          title: formData.title,
          author: new PublicKey(formData.author),
          coAuthors,
          publicationType: parseInt(formData.publicationType),
          contentUri: formData.contentUri,
          references,
          platformId: new PublicKey(formData.platformId),
        }
      );

      setLastCreatedPublication({
        signature,
        publicationPda,
      });

      // 清空表单
      setFormData({
        title: '',
        author: '',
        coAuthors: '',
        publicationType: '0',
        contentUri: '',
        references: '',
        platformId: '',
      });

    } catch (err) {
      console.error("Error creating publication:", err);
      setError(err instanceof Error ? err.message : "Failed to create publication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-publication-container">
      <h2>Create New Publication</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {lastCreatedPublication && (
        <div className="success-message">
          <h3>Publication Created Successfully!</h3>
          <div>Publication PDA: {lastCreatedPublication.publicationPda}</div>
          <div>
            <a 
              href={`https://explorer.solana.com/tx/${lastCreatedPublication.signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View transaction on Solana Explorer
            </a>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author Address *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            placeholder="Solana address"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="coAuthors">Co-Authors (comma-separated addresses)</label>
          <input
            type="text"
            id="coAuthors"
            name="coAuthors"
            value={formData.coAuthors}
            onChange={handleInputChange}
            placeholder="addr1, addr2, ..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="publicationType">Publication Type *</label>
          <select
            id="publicationType"
            name="publicationType"
            value={formData.publicationType}
            onChange={handleInputChange}
            required
          >
            <option value="0">Paper</option>
            <option value="1">Opinion</option>
            <option value="2">Review</option>
            <option value="3">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="contentUri">Content URI *</label>
          <input
            type="text"
            id="contentUri"
            name="contentUri"
            value={formData.contentUri}
            onChange={handleInputChange}
            placeholder="https://..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="references">References (comma-separated IDs)</label>
          <input
            type="text"
            id="references"
            name="references"
            value={formData.references}
            onChange={handleInputChange}
            placeholder="1, 2, 3, ..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="platformId">Platform ID *</label>
          <input
            type="text"
            id="platformId"
            name="platformId"
            value={formData.platformId}
            onChange={handleInputChange}
            placeholder="Platform public key"
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading || !wallet}
        >
          {isLoading ? 'Creating Publication...' : 'Create Publication'}
        </button>
      </form>

      {!wallet && (
        <div className="wallet-notice">
          Please connect your wallet to create a publication
        </div>
      )}
    </div>
  );
};

export default CreatePublicationForm;