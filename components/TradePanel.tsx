import React, { useState, useEffect } from 'react';
import type { ContractType, DurationUnit, PriceLine, TradeStatus } from '../types';

interface PlaceTradeOptions {
  barrier?: string | number;
  barrier2?: string | number;
  duration?: number;
  duration_unit?: DurationUnit;
}

interface TradePanelProps {
  placeTrade: (amount: number, contractType: ContractType, options?: PlaceTradeOptions) => Promise<any>;
  lastPrice: number;
  onBarrierChange: (lines: PriceLine[]) => void;
  disabled: boolean;
}

const Toast: React.FC<{ status: TradeStatus, message: string, onDismiss: () => void }> = ({ status, message, onDismiss }) => {
  if (!status) return null;

  const bgColor = status === 'success' ? 'bg-green-600' : 'bg-red-600';

  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`fixed bottom-5 right-5 ${bgColor} text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out z-50`}>
      <div className="flex items-center">
        <span>{message}</span>
        <button onClick={onDismiss} className="ml-4 text-xl font-bold">&times;</button>
      </div>
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={`block w-10 h-6 rounded-full ${checked ? 'bg-deriv-green' : 'bg-gray-600'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-full' : ''}`}></div>
      </div>
      <div className="ml-3 text-gray-400 text-sm font-medium">{label}</div>
    </label>
  );
}

const InputGroup: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-400 w-28 flex-shrink-0">{label}:</label>
        {children}
    </div>
);

const NumberInput: React.FC<{ value: number; onChange: (value: number) => void; }> = ({ value, onChange }) => (
    <input
        type="number"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-deriv-dark-300 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-deriv-green"
    />
);

// Define icons as reusable components
const UpIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const DownIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
const TouchIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.057V7.004a7 7 0 101.996 0V5.057a9 9 0 00-1.996 0zM12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const InOutIcon = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4m12 4V4h-4M4 16v4h4m12-4v4h-4" /></svg>;


const TradePanel: React.FC<TradePanelProps> = ({ placeTrade, lastPrice, onBarrierChange, disabled }) => {
  const [amount, setAmount] = useState<number>(10);
  const [isTrading, setIsTrading] = useState(false);
  const [tradeStatus, setTradeStatus] = useState<TradeStatus>(null);
  const [tradeError, setTradeError] = useState('');
  const [confirmTrades, setConfirmTrades] = useState(false);
  const [activeTab, setActiveTab] = useState('up-down');
  
  // State for different trade types
  const [tickDuration, setTickDuration] = useState<number>(5);
  const [longDuration, setLongDuration] = useState<number>(15);
  const [longDurationUnit, setLongDurationUnit] = useState<DurationUnit>('m');
  const [barrierOffset, setBarrierOffset] = useState<number>(20);
  const [highBarrierOffset, setHighBarrierOffset] = useState<number>(20);
  const [lowBarrierOffset, setLowBarrierOffset] = useState<number>(-20);

  const tradeTabs = [
    { id: 'up-down', label: 'Up/Down' },
    { id: 'touch', label: 'Touch/No Touch' },
    { id: 'in-out', label: 'In/Out' },
  ];

  const durationUnitsOptions = [
      { value: 't', text: 'Ticks'},
      { value: 's', text: 'Seconds'},
      { value: 'm', text: 'Minutes'},
      { value: 'h', text: 'Hours'},
      { value: 'd', text: 'Days'},
  ];

  useEffect(() => {
    if (!lastPrice) return;
    const lines: PriceLine[] = [];
    if (activeTab === 'touch') {
      lines.push({ price: lastPrice + barrierOffset, color: '#3B82F6', title: 'Barrier' });
    } else if (activeTab === 'in-out') {
      lines.push({ price: lastPrice + lowBarrierOffset, color: '#EF5350', title: 'Low' });
      lines.push({ price: lastPrice + highBarrierOffset, color: '#00A79E', title: 'High' });
    }
    onBarrierChange(lines);
  }, [activeTab, barrierOffset, highBarrierOffset, lowBarrierOffset, lastPrice, onBarrierChange]);

  const handleTrade = async (contractType: ContractType, label: string) => {
    if (disabled || isTrading || amount <= 0) return;
    if (confirmTrades && !window.confirm(`Place a ${label} trade for $${amount}?`)) return;
    setIsTrading(true);
    setTradeStatus(null);
    setTradeError('');

    try {
      const options: PlaceTradeOptions = {};
      
      switch(activeTab) {
        case 'up-down':
          options.duration_unit = longDurationUnit;
          options.duration = longDurationUnit === 't' ? tickDuration : longDuration;
          break;
        case 'touch':
          options.duration_unit = 't';
          options.duration = tickDuration;
          options.barrier = barrierOffset.toString();
          break;
        case 'in-out':
          options.duration_unit = 't';
          options.duration = tickDuration;
          options.barrier = lowBarrierOffset.toString();
          options.barrier2 = highBarrierOffset.toString();
          break;
      }

      const result = await placeTrade(amount, contractType, options);
      if (result) {
        setTradeStatus('success');
      } else {
        // This case might not be hit if placeTrade throws, but as a fallback.
        setTradeStatus('error');
        setTradeError('Trade was not successful.');
      }

    } catch (error: any) {
      console.error('Trade execution failed', error);
      setTradeStatus('error');
      setTradeError(error.message || 'An unknown error occurred.');
    } finally {
      setIsTrading(false);
    }
  };
  
  const renderContent = () => {
      switch(activeTab) {
          case 'up-down':
              return (
                  <div className="space-y-4">
                      <InputGroup label="Stake"><NumberInput value={amount} onChange={setAmount} /></InputGroup>
                      <InputGroup label="Duration">
                          <select
                              value={longDurationUnit}
                              onChange={(e) => setLongDurationUnit(e.target.value as DurationUnit)}
                              className="bg-deriv-dark-300 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-deriv-green"
                          >
                              {durationUnitsOptions.map(du => <option key={du.value} value={du.value}>{du.text}</option>)}
                          </select>
                          <NumberInput value={longDurationUnit === 't' ? tickDuration : longDuration} onChange={longDurationUnit === 't' ? setTickDuration : setLongDuration} />
                      </InputGroup>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                           <button onClick={() => handleTrade('CALL', 'Rise')} disabled={disabled || isTrading} className="flex flex-col items-center justify-center text-white font-bold py-4 px-4 rounded-md transition-colors h-full disabled:bg-gray-600 disabled:cursor-not-allowed bg-deriv-green hover:bg-teal-500"><UpIcon /><span>Rise</span></button>
                           <button onClick={() => handleTrade('PUT', 'Fall')} disabled={disabled || isTrading} className="flex flex-col items-center justify-center text-white font-bold py-4 px-4 rounded-md transition-colors h-full disabled:bg-gray-600 disabled:cursor-not-allowed bg-deriv-red hover:bg-red-700"><DownIcon /><span>Fall</span></button>
                      </div>
                  </div>
              );
          case 'touch':
               return (
                  <div className="space-y-4">
                      <InputGroup label="Stake"><NumberInput value={amount} onChange={setAmount} /></InputGroup>
                      <InputGroup label="Ticks"><NumberInput value={tickDuration} onChange={setTickDuration} /></InputGroup>
                      <InputGroup label="Barrier Offset"><NumberInput value={barrierOffset} onChange={setBarrierOffset} /></InputGroup>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                          <button onClick={() => handleTrade('ONETOUCH', 'Touch')} disabled={disabled || isTrading} className="flex flex-col items-center justify-center text-white font-bold py-4 px-4 rounded-md transition-colors h-full disabled:bg-gray-600 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"><TouchIcon /><span>Touch</span></button>
                          <button onClick={() => handleTrade('NOTOUCH', 'No Touch')} disabled={disabled || isTrading} className="flex flex-col items-center justify-center text-white font-bold py-4 px-4 rounded-md transition-colors h-full disabled:bg-gray-600 disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-600"><TouchIcon /><span>No Touch</span></button>
                      </div>
                  </div>
              );
          case 'in-out':
              return (
                  <div className="space-y-4">
                      <InputGroup label="Stake"><NumberInput value={amount} onChange={setAmount} /></InputGroup>
                      <InputGroup label="Ticks"><NumberInput value={tickDuration} onChange={setTickDuration} /></InputGroup>
                      <InputGroup label="High Barrier"><NumberInput value={highBarrierOffset} onChange={setHighBarrierOffset} /></InputGroup>
                      <InputGroup label="Low Barrier"><NumberInput value={lowBarrierOffset} onChange={setLowBarrierOffset} /></InputGroup>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                          <button onClick={() => handleTrade('EXPIRYRANGE', 'Ends Between')} disabled={disabled || isTrading} className="flex flex-col items-center justify-center text-white font-bold py-4 px-4 rounded-md transition-colors h-full disabled:bg-gray-600 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-700"><InOutIcon /><span>Ends Between</span></button>
                          <button onClick={() => handleTrade('EXPIRYMISSE', 'Ends Outside')} disabled={disabled || isTrading} className="flex flex-col items-center justify-center text-white font-bold py-4 px-4 rounded-md transition-colors h-full disabled:bg-gray-600 disabled:cursor-not-allowed bg-orange-600 hover:bg-orange-700"><InOutIcon /><span>Ends Outside</span></button>
                      </div>
                  </div>
              );
          default:
              return null;
      }
  }

  return (
    <div className="flex flex-col h-full">
      <Toast 
        status={tradeStatus} 
        message={tradeStatus === 'success' ? 'Trade placed successfully!' : `Trade Failed: ${tradeError}`} 
        onDismiss={() => setTradeStatus(null)} />
      <h2 className="text-xl font-bold text-center text-gray-200 mb-4 flex-shrink-0">Trade Panel</h2>
      
      <div className="flex border-b border-deriv-dark-300 overflow-x-auto flex-shrink-0">
        {tradeTabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-sm font-semibold py-2 px-4 transition-colors duration-200 whitespace-nowrap ${activeTab === tab.id ? 'text-deriv-green border-b-2 border-deriv-green' : 'text-gray-400 hover:bg-deriv-dark-300/50'}`}
            >
                {tab.label}
            </button>
        ))}
      </div>
      
      <div className="flex-grow py-4 overflow-y-auto">
          {renderContent()}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-deriv-dark-300 flex-shrink-0">
        <Toggle
          label="Confirm Trades"
          checked={confirmTrades}
          onChange={setConfirmTrades}
        />
        <p className="text-xs text-right text-gray-500">
            3% commission applies
        </p>
      </div>

      {isTrading && (
        <div className="text-center text-yellow-400 animate-pulse pt-2">
          Placing trade...
        </div>
      )}
    </div>
  );
};

export default TradePanel;