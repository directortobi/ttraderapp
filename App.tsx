import React, { useState } from 'react';
import TokenModal from './components/TokenModal';
import TradingScreen from './components/TradingScreen';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  const handleTokenSubmit = (submittedToken: string) => {
    if (submittedToken.trim()) {
      setToken(submittedToken.trim());
    }
  };

  return (
    <div className="min-h-screen bg-deriv-dark font-sans">
      {!token ? (
        <TokenModal onSubmit={handleTokenSubmit} />
      ) : (
        <ErrorBoundary>
          <TradingScreen token={token} onDisconnect={() => setToken(null)} />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default App;
