
import React, { useState } from 'react';

interface TokenModalProps {
  onSubmit: (token: string) => void;
}

// IMPORTANT: Replace this with your actual affiliate token from your Deriv affiliate dashboard.
const YOUR_AFFILIATE_TOKEN = 'YOUR_AFFILIATE_TOKEN_HERE';
const DERIV_SIGNUP_URL = `https://deriv.com/signup/?t=${YOUR_AFFILIATE_TOKEN}`;


const TokenModal: React.FC<TokenModalProps> = ({ onSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(token);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-deriv-dark-200 p-8 rounded-lg shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Connect to Deriv</h2>
        <p className="text-center text-gray-400 mb-6">Enter your Deriv API token to log in. Don't have an account? Create one to start trading.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Your Deriv API Token"
            className="w-full px-4 py-3 bg-deriv-dark-300 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-deriv-green"
          />
          <button
            type="submit"
            className="w-full mt-6 bg-deriv-green text-white font-bold py-3 px-4 rounded-md hover:bg-teal-500 transition-colors duration-300 disabled:bg-gray-600"
            disabled={!token.trim()}
          >
            Connect
          </button>
        </form>
        
        <div className="text-center mt-6">
           <a 
              href={DERIV_SIGNUP_URL}
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full block bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
           >
              Create a Deriv Account
           </a>
        </div>

        <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-500 rounded-md text-yellow-300 text-sm">
          <h4 className="font-bold mb-1">Security Warning</h4>
          <p>
            For production use, never expose your API token on the client-side. This demo allows direct input for convenience. In a real application, use a backend proxy to secure your token.
          </p>
           <a href="https://app.deriv.com/account/api-token" target="_blank" rel="noopener noreferrer" className="text-deriv-green hover:underline mt-2 inline-block">
              Get your API Token here
           </a>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
