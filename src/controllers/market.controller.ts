import { injectable } from "tsyringe";
import { Request, Response } from "express";
import MarketService from "../services/market.service";

@injectable()
export class MarketController {
  constructor(private marketService: MarketService) {}

  async placeOrder(req: Request) {
    return await this.marketService.placeOrder(req.body);
  }

  async getInstruments(req: Request) {
    return await this.marketService.getInstruments(req.body);
  }
}
