import { WEBSOCKET_URL } from '../constants';
// FIX: Import response types to provide strong typing for API calls.
import type { TicksHistoryResponse, SubscriptionResponse, BuyContractResponse, BuyParams, CashierResponse } from '../types';

type MessageCallback = (data: any) => void;

class DerivApiService {
  private ws: WebSocket | null = null;
  private messageListeners: Map<string, MessageCallback[]> = new Map();
  private requestCounter = 0;
  private pendingRequests: Map<number, { resolve: (value: any) => void; reject: (reason?: any) => void }> = new Map();

  connect(onOpen: () => void, onClose: () => void, onError: (error: Event) => void) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = new WebSocket(WEBSOCKET_URL);
    this.ws.onopen = onOpen;
    this.ws.onclose = onClose;
    this.ws.onerror = onError;
    this.ws.onmessage = this.handleMessage.bind(this);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private handleMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    const msgType = data.msg_type;

    if (data.req_id && this.pendingRequests.has(data.req_id)) {
      const { resolve, reject } = this.pendingRequests.get(data.req_id)!;
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data);
      }
      this.pendingRequests.delete(data.req_id);
    }
    
    if (this.messageListeners.has(msgType)) {
      this.messageListeners.get(msgType)?.forEach(cb => cb(data));
    }
  }

  private sendRequest<T>(request: object): Promise<T> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject('WebSocket is not connected.');
    }
    
    this.requestCounter += 1;
    const req_id = this.requestCounter;
    const fullRequest = { ...request, req_id };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(req_id, { resolve, reject });
      this.ws!.send(JSON.stringify(fullRequest));
    });
  }

  subscribe(msgType: string, callback: MessageCallback) {
    if (!this.messageListeners.has(msgType)) {
      this.messageListeners.set(msgType, []);
    }
    this.messageListeners.get(msgType)?.push(callback);
  }

  unsubscribeAll() {
      this.messageListeners.clear();
  }

  async authorize(token: string) {
    return this.sendRequest({ authorize: token });
  }

  async getBalance() {
     return this.sendRequest({ balance: 1, subscribe: 1 });
  }

  // FIX: Specify the response type for getTicksHistory to resolve property access errors on 'unknown' type.
  async getTicksHistory(symbol: string, granularity: number, count: number = 500) {
    return this.sendRequest<TicksHistoryResponse>({
      ticks_history: symbol,
      adjust_start_time: 1,
      count: count,
      end: 'latest',
      start: 1,
      style: 'candles',
      granularity: granularity,
    });
  }

  // FIX: Specify the response type for subscribeToTicks to resolve property access errors on 'unknown' type.
  async subscribeToTicks(symbol: string) {
    return this.sendRequest<SubscriptionResponse>({ ticks: symbol, subscribe: 1 });
  }

  async forgetSubscription(subscriptionId: string) {
      return this.sendRequest({ forget: subscriptionId });
  }

  async getPortfolio() {
      return this.sendRequest({ portfolio: 1 });
  }

  async subscribeToOpenPositions() {
      return this.sendRequest({ proposal_open_contract: 1, subscribe: 1 });
  }

  // FIX: Specify the response type for buyContract to resolve property access errors on 'unknown' type.
  async buyContract(params: BuyParams) {
      const { symbol, amount, contractType, barrier, barrier2, duration, duration_unit } = params;

      const requestPayload: any = {
          buy: 1,
          price: 100, // This is a passthrough, the actual price is determined by the API
          commission: 3, // Apply a 3% commission on the stake for each trade.
          parameters: {
              amount,
              basis: 'stake',
              contract_type: contractType,
              currency: 'USD',
              duration: duration || 5,
              duration_unit: duration_unit || 't',
              symbol
          }
      };
      
      if (barrier !== undefined) {
          requestPayload.parameters.barrier = barrier.toString();
      }

      if (barrier2 !== undefined) {
          requestPayload.parameters.barrier2 = barrier2.toString();
      }

      return this.sendRequest<BuyContractResponse>(requestPayload);
  }

  async getCashierURL(action: 'deposit' | 'withdraw') {
    return this.sendRequest<CashierResponse>({
      cashier: action,
    });
  }
}

export const derivApiService = new DerivApiService();