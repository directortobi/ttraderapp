

import React from 'react';
import type { Balance } from '../types';
import { SYMBOLS, TIMEFRAMES } from '../constants';

interface HeaderProps {
  balance: Balance | null;
  activeSymbol: string;
  granularity: number;
  onSymbolChange: (symbol: string) => void;
  onTimeframeChange: (granularity: number) => void;
  onDisconnect: () => void;
  statusIndicator: React.ReactNode;
  onCashierAction: (action: 'deposit' | 'withdraw') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  balance, 
  activeSymbol, 
  granularity, 
  onSymbolChange, 
  onTimeframeChange, 
  onDisconnect,
  statusIndicator,
  onCashierAction
}) => {
  return (
    <header className="bg-deriv-dark-200 p-2 flex flex-wrap items-center justify-between gap-4 border-b border-deriv-dark-300">
      <div className="flex items-center gap-4">
         <h1 className="text-xl font-bold text-white">DerivChart</h1>
         <div className="flex items-center gap-2">
           {statusIndicator}
           <span className="text-gray-400 font-mono">
              {balance ? `${balance.balance.toFixed(2)} ${balance.currency}` : 'Loading...'}
            </span>
         </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => onCashierAction('deposit')}
          className="bg-deriv-green text-white font-semibold py-1.5 px-4 rounded-md hover:bg-teal-500 transition-colors"
        >
          Deposit
        </button>
        <button
          onClick={() => onCashierAction('withdraw')}
          className="bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Withdraw
        </button>
        <select
          value={activeSymbol}
          onChange={(e) => onSymbolChange(e.target.value)}
          className="bg-deriv-dark-300 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-deriv-green"
        >
          {SYMBOLS.map(s => <option key={s.value} value={s.value}>{s.text}</option>)}
        </select>
        <div className="flex items-center bg-deriv-dark-300 rounded-md border border-gray-600">
            {TIMEFRAMES.map(tf => (
                <button
                    key={tf.value}
                    onClick={() => onTimeframeChange(tf.value)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${granularity === tf.value ? 'bg-deriv-green text-white' : 'text-gray-400 hover:bg-deriv-dark'}`}
                >
                    {tf.text}
                </button>
            ))}
        </div>
        <button
          onClick={onDisconnect}
          className="bg-deriv-red text-white font-semibold py-1.5 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Disconnect
        </button>
      </div>
    </header>
  );
};

export default Header;