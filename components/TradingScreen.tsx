import React, { useState } from 'react';
import Header from './Header';
import ChartComponent from './ChartComponent';
import TradePanel from './TradePanel';
import PositionsTable from './PositionsTable';
import { useDerivAPI } from '../hooks/useDerivAPI';
import { ConnectionStatus, PriceLine } from '../types';

interface TradingScreenProps {
  token: string;
  onDisconnect: () => void;
}

const TradingScreen: React.FC<TradingScreenProps> = ({ token, onDisconnect }) => {
  const { 
    connectionStatus, 
    isAuthenticated,
    balance, 
    candles, 
    openPositions, 
    error,
    activeSymbol,
    granularity,
    changeSymbol,
    changeTimeframe,
    placeTrade,
    handleCashier,
    setError
  } = useDerivAPI(token);

  const [barrierLines, setBarrierLines] = useState<PriceLine[]>([]);

  const getStatusIndicator = () => {
    switch(connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return <div className="w-3 h-3 rounded-full bg-deriv-green" title="Connected"></div>;
      case ConnectionStatus.CONNECTING:
        return <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" title="Connecting..."></div>;
      case ConnectionStatus.DISCONNECTED:
        return <div className="w-3 h-3 rounded-full bg-gray-500" title="Disconnected"></div>;
      case ConnectionStatus.ERROR:
        return <div className="w-3 h-3 rounded-full bg-deriv-red" title="Error"></div>;
    }
  };

  return (
    <div className="flex flex-col h-screen text-white">
      <Header
        balance={balance}
        activeSymbol={activeSymbol}
        granularity={granularity}
        onSymbolChange={changeSymbol}
        onTimeframeChange={changeTimeframe}
        onDisconnect={onDisconnect}
        statusIndicator={getStatusIndicator()}
        onCashierAction={handleCashier}
      />
      <main className="flex-grow flex flex-col md:flex-row p-2 gap-2 overflow-y-auto">
        <section className="flex-grow flex flex-col gap-2">
          {error && (
            <div className="bg-red-900/50 border border-deriv-red text-red-300 px-4 py-2 rounded-md flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="font-bold text-lg">&times;</button>
            </div>
          )}
          <div className="flex-grow bg-deriv-dark-200 rounded-md p-1 min-h-[300px]">
            <ChartComponent candles={candles} barrierLines={barrierLines} />
          </div>
          <div className="bg-deriv-dark-200 rounded-md p-4 hidden md:block">
            <h2 className="text-lg font-semibold mb-2 text-gray-300">Open Positions</h2>
            <PositionsTable positions={openPositions} />
          </div>
        </section>
        <aside className="w-full md:w-1/3 bg-deriv-dark-200 rounded-md p-4 flex flex-col">
          <TradePanel 
            placeTrade={placeTrade} 
            lastPrice={candles[candles.length - 1]?.close}
            onBarrierChange={setBarrierLines}
            disabled={!isAuthenticated || connectionStatus !== ConnectionStatus.CONNECTED}
          />
           <div className="bg-deriv-dark-200 rounded-md p-4 mt-4 block md:hidden">
             <h2 className="text-lg font-semibold mb-2 text-gray-300">Open Positions</h2>
             <PositionsTable positions={openPositions} />
           </div>
        </aside>
      </main>
    </div>
  );
};

export default TradingScreen;
