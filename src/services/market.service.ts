import { injectable } from "tsyringe";
import { createBroker } from "../broker/broker-factory";
import getEnv from "../utils/env";
import AuthService from "./auth.service";

@injectable()
class MarketService {
  constructor(private authService: AuthService) {}

  private getBrokerIdentifier(requestBody: Record<string, any>) {
    const { user } = requestBody;
    const { privateKey: privateAPIkey, publicKey: publicAPIkey } = user;
    return this.init({ privateAPIkey, publicAPIkey });
  }

  getBrokerUserFromToken(requestBody: Record<string, any>) {
    const { token } = requestBody;
    const user = this.authService.verifyUserToken(token);
    return this.getBrokerIdentifier(user);
  }

  async placeOrder(requestBody: Record<string, any>) {
    const { user, ...order } = requestBody;
    const broker = this.getBrokerIdentifier(requestBody);
    return broker.placeOrder(order);
  }

  async getInstruments(requestBody: Record<string, any>) {
    const broker = this.getBrokerIdentifier(requestBody);
    return broker.getInstruments();
  }

  private init({
    privateAPIkey,
    publicAPIkey,
  }: {
    privateAPIkey: string;
    publicAPIkey: string;
  }) {
    const brokerType = getEnv("BROKER_TYPE");
    const broker = createBroker(brokerType, {
      publicAPIkey: publicAPIkey,
      privateAPIkey: privateAPIkey,
    });
    return broker;
  }
}

export default MarketService;
