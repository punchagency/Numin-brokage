import "reflect-metadata";
import websocketProcess from "./utils/ws-server";
import express, { NextFunction, Request, Response } from "express";
import routes from "./routes/index";
import cors from "cors";

const bootstrap = async () => {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
  });

  //REST Process
  app.use("/api", routes);

  //WS Process
  websocketProcess();

  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
};

bootstrap();

// async function restProcess() {
//   // const broker = init({ privateAPIkey, publicAPIkey });
//   // const instruments = await broker.getInstruments();
//   // console.log(instruments);
//   //Place order
//   // const order = await broker.placeOrder({
//   //   orderType: "post",
//   //   symbol: "PF_XBTUSD",
//   //   side: "buy",
//   //   size: "1",
//   //   limitPrice: "1",
//   //   cliOrdId: "test",
//   // });
//   // console.log(order);
//   // Cancel order
//   // const cancelOrder = await broker.cancelOrder("test");
//   // console.log(cancelOrder);
//   //Edit order
//   // const editOrder = await broker.editOrder({
//   //   cliOrdId: "test",
//   //   symbol: "PF_XBTUSD",
//   //   side: "buy",
//   //   size: "1",
//   // });
//   // console.log(editOrder);
//   //Get positions
//   // const positions = await broker.getPositions();
//   // console.log(positions);
//   //Get Open Orders
//   // const orders = await broker.openOrders();
//   // console.log(orders);
//   // Get balance
//   // Get balance
//   // const balance = await broker.getBalance();
//   // console.log("Balance:", balance);
// }

///REST ... still needs to add endpoints
// restProcess();

////////WS
// websocketProcess();

////Old ways...
// import { container } from "tsyringe";
// import ScrapeService from "./services/scrape.service";

// console.log("Hello World");

// (async () => {
//   const scraper = container.resolve(ScrapeService);
//   await scraper.scrape();
// })();
