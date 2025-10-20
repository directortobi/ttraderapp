
export enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Balance {
  balance: number;
  currency: string;
}

export type ContractType =
  | 'CALL'
  | 'PUT'
  | 'CALLE'
  | 'PUTE'
  | 'ASIANU'
  | 'ASIAND'
  | 'DIGITMATCH'
  | 'DIGITDIFF'
  | 'DIGITODD'
  | 'DIGITEVEN'
  | 'DIGITOVER'
  | 'DIGITUNDER'
  | 'EXPIRYRANGE'
  | 'EXPIRYMISSE'
  | 'RANGE'
  | 'UPORDOWN'
  | 'ONETOUCH'
  | 'NOTOUCH'
  | 'RESETCALL'
  | 'RESETPUT';

export type DurationUnit = 't' | 's' | 'm' | 'h' | 'd';

export interface OpenPosition {
  contract_id: number;
  longcode: string;
  contract_type: ContractType;
  buy_price: number;
  profit: number | null;
}

export interface Tick {
  epoch: number;
  quote: number;
  symbol: string;
}

export interface TicksHistoryResponse {
  history?: {
    prices: number[];
    times: number[];
  };
  error?: { message: string };
}

export interface SubscriptionResponse {
  subscription: {
    id: string;
  };
  error?: { message: string };
}

export interface BuyParams {
    symbol: string;
    amount: number;
    contractType: ContractType;
    barrier?: string | number;
    barrier2?: string | number;
    duration?: number;
    duration_unit?: DurationUnit;
}

export interface BuyContractResponse {
  buy: {
    contract_id: number;
  };
  error?: { message: string };
}

export interface CashierResponse {
  cashier?: {
    url?: string;
  };
  error?: { message: string };
}

export interface PriceLine {
  price: number;
  color: string;
  title: string;
}

export type TradeStatus = 'success' | 'error' | null;
