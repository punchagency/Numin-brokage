import { injectable } from "tsyringe";
import { AbstractBroker } from "../abstract-broker";
import { createHash, createHmac } from "crypto";
import WebSocket, { WebSocketServer } from "ws";

@injectable()
class KrakenProvider extends AbstractBroker {
  private publicAPIkey: string;
  private privateAPIkey: string;
  private baseURL: string;
  private baseWsUrl: string;
  private ws?: WebSocket; //kraken websocket
  //  wss?: WebSocketServer; //our websocket server
  private wsChallengeId: string = "";
  private wsSignedChallenge: string = "";

  constructor(options: Record<string, any>) {
    super(options);

    console.log({ options: this.config });
    this.publicAPIkey = this.config.publicAPIkey;
    this.privateAPIkey = this.config.privateAPIkey;
    // this.baseURL = "https://futures.kraken.com";
    this.baseURL = "https://demo-futures.kraken.com";
    this.baseWsUrl = "wss://demo-futures.kraken.com/ws/v1";
  }

  ///////REST ///////////////
  async getInstruments() {
    try {
      this.log(`Getting instruments`);
      const response = await this.request({
        method: "GET",
        path: "/derivatives/api/v3/instruments",
        environment: this.baseURL,
      });

      const data = await response.json();
      console.log({ data: data.instruments });

      return {
        instruments: data.instruments,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async placeOrder(order: Record<string, any>) {
    try {
      this.log(`Placing order ${order}`);

      const response = await this.request({
        method: "POST",
        path: "/derivatives/api/v3/sendorder",
        environment: this.baseURL,
        body: order,
      });

      const data = await response.json();
      console.log({ data });

      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async editOrder(order: Record<string, any>) {
    try {
      this.log(`Editing order ${order}`);

      const response = await this.request({
        method: "POST",
        path: "/derivatives/api/v3/editorder",
        environment: this.baseURL,
        body: order,
      });

      const data = await response.json();
      console.log({ data });

      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async openOrders() {
    try {
      this.log(`Open orders`);

      const response = await this.request({
        method: "GET",
        path: "/derivatives/api/v3/openorders",
        environment: this.baseURL,
      });

      const data = await response.json();
      console.log({ data });

      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async cancelOrder(orderId: string) {
    try {
      this.log(`Cancelling order ${orderId}`);
      const response = await this.request({
        method: "POST",
        path: "/derivatives/api/v3/cancelorder",
        environment: this.baseURL,
        body: {
          cliOrdId: orderId,
        },
      });

      const data = await response.json();
      console.log({ data });

      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getBalance() {
    try {
      this.log(`Getting balance`);
      const response = await this.request({
        method: "GET",
        path: "/derivatives/api/v3/accounts",
        environment: this.baseURL,
      });

      const data = await response.json();
      console.log({ data });

      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getPositions() {
    try {
      this.log(`Getting positions`);
      const response = await this.request({
        method: "GET",
        path: "/derivatives/api/v3/openpositions",
        environment: this.baseURL,
      });

      const data = await response.json();
      console.log({ data });

      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /////////////////////
  ///WS///
  connectWebSocket() {
    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }

      this.ws = new WebSocket(this.baseWsUrl);

      this.ws.on("open", () => {
        console.log("✅ Kraken WS connected");
        this.ws?.send(
          JSON.stringify({
            event: "challenge",
            api_key: this.publicAPIkey,
          })
        );
      });

      /***
       * TODO: Now a new websocket will be created for our client and it
       * consumes this websocket.
       *
       */
      // this.connectWebSocketServer();

      this.ws.on("message", (data) => {
        console.log({ data }, "On challenge");
        const parsed = JSON.parse(data.toString());
        if (parsed instanceof Object) {
          switch (parsed.event) {
            case "challenge":
              this.wsChallengeId = parsed.message;
              this.wsSignedChallenge = this.sign({ message: parsed.message });
              break;
            case "subscribed":
              console.log({ parsed }, "subscribed");
              break;
          }

          switch (parsed.feed) {
            case "open_orders_verbose_snapshot":

            case "open_orders_snapshot":
              console.log({ parsed }, "open-orders");
              break;
          }
        }

        console.log({ parsed });
      });

      this.ws.on("close", () => {
        console.log("Socket closed");
      });
    } catch (err) {
      console.log({ err });
    }
  }

  sendWSRequest(item: Record<string, any>) {
    switch (item.type) {
      case "openOrders":
        this.ws?.send(
          JSON.stringify({
            event: "subscribe",
            feed: "open_orders_verbose",
            api_key: this.publicAPIkey,
            original_challenge: this.wsChallengeId,
            signed_challenge: this.wsSignedChallenge,
          })
        );
    }
  }

  // private connectWebSocketServer() {
  //   this.wss = new WebSocketServer({ port: 8080 });

  //   this.wss.on("connection", (socket) => {
  //     console.log("🔌 Client connected");

  //     socket.on("message", async (data) => {
  //       try {
  //         const msg = JSON.parse(data.toString());
  //         console.log("📩 Message received:", msg);

  //         // Example: msg = { type: "placeOrder",  payload: {...} }

  //         switch (msg.type) {
  //           case "openOrders":
  //             this.ws?.send(
  //               JSON.stringify({
  //                 event: "subscribe",
  //                 feed: "open_orders_verbose",
  //                 api_key: this.publicAPIkey,
  //                 original_challenge: this.wsChallengeId,
  //                 signed_challenge: this.wsSignedChallenge,
  //               })
  //             );
  //         }

  //         // const broker = createBroker(msg.broker, msg.options || {});

  //         // if (msg.type === "placeOrder") {
  //         //   broker.placeOrder(msg.payload);
  //         //   socket.send(
  //         //     JSON.stringify({
  //         //       status: "ok",
  //         //       type: "order",
  //         //       payload: msg.payload,
  //         //     })
  //         //   );
  //         // }

  //         // Add more actions as needed
  //       } catch (err: any) {
  //         console.error("❌ Error handling message:", err);
  //         socket.send(JSON.stringify({ status: "error", error: err.message }));
  //       }
  //     });

  //     socket.on("close", () => {
  //       console.log("❎ Client disconnected");
  //     });
  //   });
  // }
  ///////////

  private request({
    method = "GET",
    path = "",
    query = {},
    body = {},
    nonce = "",
    environment = "",
  }) {
    let url = environment + path;
    let queryString = "";
    if (Object.keys(query).length > 0) {
      queryString = this.mapToURLValues(query).toString();
      url += "?" + queryString;
    }
    let bodyString = null;
    if (Object.keys(body).length > 0) {
      bodyString = this.mapToURLValues(body).toString();
    }
    const headers: Record<string, any> = {};
    if (this.publicAPIkey.length > 0) {
      headers["APIKey"] = this.publicAPIkey;
      headers["Authent"] = this.getSignature(
        queryString + (bodyString ?? ""),
        nonce,
        path
      );
      if (nonce.length > 0) {
        headers["Nonce"] = nonce;
      }
    }

    console.log({ url, headers, bodyString });
    return fetch(url, { method: method, headers: headers, body: bodyString });
  }

  private getSignature(data = "", nonce = "", path = "") {
    return this.sign({
      message: createHash("sha256")
        .update(data + nonce + path.replace("/derivatives", ""))
        .digest("binary"),
    });
  }

  private sign({ message = "" }) {
    return createHmac("sha512", Buffer.from(this.privateAPIkey, "base64"))
      .update(message, "binary")
      .digest("base64");
  }

  private mapToURLValues(object: Record<string, any>) {
    return new URLSearchParams(
      Object.entries(object).map(([k, v]) => {
        if (typeof v == "object") {
          v = JSON.stringify(v);
        }
        return [k, v];
      })
    );
  }
}

export default KrakenProvider;
