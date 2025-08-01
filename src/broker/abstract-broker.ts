import { IBroker } from "./ibroker";

export abstract class AbstractBroker implements IBroker {
  protected config: Record<string, any>;

  constructor(options: Record<string, any>) {
    this.config = options;
    this.log("Broker initialized with config");
  }

  abstract placeOrder(order: Record<string, any>): Promise<Record<string, any>>;
  abstract editOrder(order: Record<string, any>): Promise<Record<string, any>>;
  abstract cancelOrder(orderId: string): Promise<Record<string, any>>;
  abstract openOrders(): Promise<Record<string, any>>;
  abstract getBalance(): Promise<Record<string, any>>;
  abstract getPositions(): Promise<Record<string, any>>;
  abstract connectWebSocket(item: Record<string, any>): void;
  // abstract sendWSRequest(item: Record<string, any>): void;

  //	Get instruments/market data
  abstract getInstruments(): Promise<Record<string, any>>;

  protected log(message: string) {
    console.log(`[Broker Log]: ${message}`);
  }
}
