import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { CreatePlatformForm } from './CreatePlatform';
import { PlatformList } from './PlatformList';
import { CreatePublicationForm } from './CreatePublicationForm';
import { PublicationList } from './PublicationList';

const Dashboard: FC = () => {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState('platform');

  return (
    <div className="dashboard">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'platform' ? 'active' : ''}`}
          onClick={() => setActiveTab('platform')}
        >
          Platform Management
        </button>
        <button 
          className={`tab ${activeTab === 'publication' ? 'active' : ''}`}
          onClick={() => setActiveTab('publication')}
        >
          Publications
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="content">
        {activeTab === 'platform' ? (
          <div>
            <PlatformList />
            <CreatePlatformForm />
          </div>
        ) : activeTab === 'publication' ? (
          <div>
            <PublicationList />
            <CreatePublicationForm />
          </div>
        ) : activeTab === 'analytics' ? (
          <AnalyticsView />
        ) : (
          <div>Unknown tab</div>
        )}
      </div>
    </div>
  );
};

// 临时的 Analytics 组件
const AnalyticsView: FC = () => {
  return (
    <div className="coming-soon">
      <h3>Analytics Coming Soon...</h3>
      <p>Citation metrics and research impact analysis will be available here.</p>
    </div>
  );
};

export default Dashboard;