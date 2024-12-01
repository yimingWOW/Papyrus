// src/App.tsx
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { FC } from 'react';
import Dashboard from './components/DashBoard';
import './App.css';
import '@solana/wallet-adapter-react-ui/styles.css';

const App: FC = () => {
  const { connected } = useWallet();

  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="title">Papyrus</h1>
          <WalletMultiButton />
        </div>
      </nav>
      
      <main className="main-content">
        {!connected ? (
          <div className="connect-prompt">
            <h2>Please connect your wallet to continue</h2>
          </div>
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
};

export default App;