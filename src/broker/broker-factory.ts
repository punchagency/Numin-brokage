// import { KrakenBroker } from '../brokers/KrakenBroker';
// import { BinanceBroker } from '../brokers/BinanceBroker';

import { container } from "tsyringe";
import { IBroker } from "./ibroker";
import KrakenProvider from "./providers/kraken";

type BrokerConstructor = new (options: Record<string, any>) => IBroker;

const brokerMap: Record<string, BrokerConstructor> = {
  kraken: KrakenProvider,
  // binance: (options) => new BinanceBroker(options),
};

export function createBroker(
  type: string,
  options: Record<string, any>
): IBroker {
  const factory = brokerMap[type];
  if (!factory) {
    throw new Error(`Unsupported broker type: ${type}`);
  }
  return new factory(options);
}
