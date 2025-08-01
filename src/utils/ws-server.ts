import { WebSocketServer } from "ws";
import { container } from "tsyringe";
import MarketService from "../services/market.service";

const websocketProcess = () => {
  const wss = new WebSocketServer({ port: 8080 });
  const marketService = container.resolve(MarketService);

  wss.on("connection", (socket) => {
    console.log("🔌 Client connected");

    socket.on("message", async (data) => {
      try {
        const msg = JSON.parse(data.toString());
        console.log("📩 Message received:", msg);

        const broker = marketService.getBrokerUserFromToken(msg);
        // Example: msg = { type: "placeOrder",  payload: {...} }

        broker.connectWebSocket({ parentSocket: socket, ...msg });

        // broker.sendWSRequest(msg);

        // const broker = createBroker(msg.broker, msg.options || {});

        // if (msg.type === "placeOrder") {
        //   broker.placeOrder(msg.payload);
        //   socket.send(
        //     JSON.stringify({
        //       status: "ok",
        //       type: "order",
        //       payload: msg.payload,
        //     })
        //   );
        // }

        // Add more actions as needed
      } catch (err: any) {
        console.error("❌ Error handling message:", err);
        socket.send(JSON.stringify({ status: "error", error: err.message }));
      }
    });

    socket.on("close", () => {
      console.log("❎ Client disconnected");
    });
  });
};

export default websocketProcess;
