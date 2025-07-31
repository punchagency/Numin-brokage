export interface IBroker {
  getInstruments(): Promise<any>;
  placeOrder(order: any): Promise<Record<string, any>>;
  openOrders(): Promise<Record<string, any>>;
  editOrder(order: any): Promise<Record<string, any>>;
  cancelOrder(orderId: string): Promise<Record<string, any>>;
  getBalance(): Promise<Record<string, any>>;
  getPositions(): Promise<Record<string, any>>;
  connectWebSocket(): void;
  sendWSRequest(item: Record<string, any>): void;
}
