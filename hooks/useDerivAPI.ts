

import { useState, useEffect, useCallback, useRef } from 'react';
import { derivApiService } from '../services/derivApiService';
// FIX: Import DurationUnit to use in PlaceTradeOptions.
import type { Candle, Balance, OpenPosition, Tick, ContractType, DurationUnit } from '../types';
import { ConnectionStatus } from '../types';

interface PlaceTradeOptions {
  barrier?: string | number;
  barrier2?: string | number;
  duration?: number;
  // FIX: Change type from string to DurationUnit to match the expected type in derivApiService.buyContract.
  duration_unit?: DurationUnit;
}

export const useDerivAPI = (token: string) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.CONNECTING);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [openPositions, setOpenPositions] = useState<OpenPosition[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeSymbol, setActiveSymbol] = useState('R_100');
  const [granularity, setGranularity] = useState(60);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const tickSubscriptionId = useRef<string | null>(null);

  const mapCandleData = (history: { prices: number[], times: number[] }): Candle[] => {
    return history.times.map((time, index) => {
        const baseIndex = index * 4;
        return {
            time: time,
            open: history.prices[baseIndex],
            close: history.prices[baseIndex + 1],
            high: history.prices[baseIndex + 2],
            low: history.prices[baseIndex + 3],
        };
    }).sort((a, b) => a.time - b.time);
  };

  const updateCandlesWithTick = (tick: { epoch: number, quote: number }) => {
    setCandles(prevCandles => {
        const newCandles = [...prevCandles];
        const lastCandle = newCandles[newCandles.length - 1];
        if (!lastCandle || !tick) return prevCandles;

        if (tick.epoch >= lastCandle.time + granularity) {
            // New candle
            const newCandleTime = lastCandle.time + granularity;
            newCandles.push({
                time: newCandleTime,
                open: tick.quote,
                high: tick.quote,
                low: tick.quote,
                close: tick.quote,
            });
        } else {
            // Update last candle
            lastCandle.close = tick.quote;
            lastCandle.high = Math.max(lastCandle.high, tick.quote);
            lastCandle.low = Math.min(lastCandle.low, tick.quote);
        }
        return newCandles;
    });
  };

  const setupSubscriptions = useCallback(async (symbol: string, timeGranularity: number) => {
    setError(null);
    setCandles([]);
    
    // Forget previous tick subscription
    if (tickSubscriptionId.current) {
      await derivApiService.forgetSubscription(tickSubscriptionId.current);
      tickSubscriptionId.current = null;
    }

    try {
      const historyData = await derivApiService.getTicksHistory(symbol, timeGranularity);
      if(historyData.history) {
        setCandles(mapCandleData(historyData.history));
      }

      const tickSubscription = await derivApiService.subscribeToTicks(symbol);
      tickSubscriptionId.current = tickSubscription.subscription.id;
    } catch (e: any) {
        console.error('Failed to fetch history or subscribe to ticks:', e);
        setError(`Failed to load data for ${symbol}: ${e?.message || 'Unknown error'}`);
    }
  }, []);

  useEffect(() => {
    const onOpen = async () => {
      try {
        await derivApiService.authorize(token);
        setIsAuthenticated(true);
        setConnectionStatus(ConnectionStatus.CONNECTED);
        
        derivApiService.getBalance();
        derivApiService.getPortfolio();
        derivApiService.subscribeToOpenPositions();
        
        await setupSubscriptions(activeSymbol, granularity);

      } catch (e: any) {
        console.error("Authorization failed:", e);
        setError(`Authentication failed: ${e?.message || 'Invalid token'}`);
        setConnectionStatus(ConnectionStatus.ERROR);
        setIsAuthenticated(false);
      }
    };
    const onClose = () => {
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
        setIsAuthenticated(false);
    };
    const onError = () => {
        setError('Connection error occurred.');
        setConnectionStatus(ConnectionStatus.ERROR);
        setIsAuthenticated(false);
    };

    derivApiService.connect(onOpen, onClose, onError);

    derivApiService.subscribe('balance', data => setBalance(data.balance));
    derivApiService.subscribe('portfolio', data => {
        if (data.portfolio?.contracts) {
            setOpenPositions(data.portfolio.contracts);
        }
    });
    derivApiService.subscribe('proposal_open_contract', data => {
        const contract = data.proposal_open_contract;
        if (!contract) return;
        setOpenPositions(prev => {
            const existing = prev.find(p => p.contract_id === contract.contract_id);
            if (existing) {
                // Update existing position
                return prev.map(p => p.contract_id === contract.contract_id ? { ...p, ...contract } : p);
            } else {
                // Add new position
                return [...prev, contract];
            }
        });
    });
    derivApiService.subscribe('tick', data => {
      if(data.tick?.symbol === activeSymbol) {
        updateCandlesWithTick(data.tick);
      }
    });

    return () => {
        derivApiService.unsubscribeAll();
        derivApiService.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeSymbol, granularity, setupSubscriptions]);
  
  const changeSymbol = useCallback((newSymbol: string) => {
      if(newSymbol !== activeSymbol) {
          setActiveSymbol(newSymbol);
      }
  }, [activeSymbol]);

  const changeTimeframe = useCallback((newGranularity: number) => {
    if (newGranularity !== granularity) {
      setGranularity(newGranularity);
    }
  }, [granularity]);

  const placeTrade = useCallback(async (amount: number, contractType: ContractType, options?: PlaceTradeOptions) => {
      try {
          const result = await derivApiService.buyContract({
              symbol: activeSymbol, 
              amount, 
              contractType,
              ...options
          });
          if (result.error) {
              throw new Error(result.error.message);
          }
          return result.buy;
      } catch (e: any) {
          console.error("Trade failed:", e);
          setError(`Trade failed: ${e.message}`);
          return null;
      }
  }, [activeSymbol]);
  
  const handleCashier = useCallback(async (action: 'deposit' | 'withdraw') => {
    try {
      const response = await derivApiService.getCashierURL(action);
      if (response.error) {
        throw new Error(response.error.message);
      }
      if (response.cashier?.url) {
        window.open(response.cashier.url, '_blank');
      } else {
        throw new Error('Could not retrieve the cashier URL.');
      }
    } catch (e: any) {
      console.error(`Failed to open cashier for ${action}:`, e);
      setError(`Failed to open cashier: ${e.message}`);
    }
  }, []);

  return { 
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
  };
};