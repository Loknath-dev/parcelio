const WS_URL = "wss://node-js-1m94.onrender.com";

class MessageApi {
  constructor() {
    this.ws = null;
    this.statusListeners = new Set();
    this.messageListeners = new Set();

    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.reconnectAttempts = 0;
    this.manualClose = false;
  }

  connect() {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    this.manualClose = false;

    console.log("WebSocket connecting:", WS_URL);

    const ws = new WebSocket(WS_URL);

    this.ws = ws;

    ws.onopen = () => {
      if (this.ws !== ws) return;

      console.log("✅ WebSocket connected");

      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.emitStatus(true);
    };

    ws.onmessage = (event) => {
      if (this.ws !== ws) return;

      try {
        const data = JSON.parse(event.data);

        if (data?.type === "pong") return;

        this.messageListeners.forEach((listener) => {
          listener(data);
        });
      } catch {
        console.warn("Invalid WebSocket message:", event.data);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = (event) => {
      if (this.ws !== ws) return;

      console.warn(
        `WebSocket closed: ${event.code} ${event.reason || "no reason"}`,
      );

      this.stopHeartbeat();
      this.ws = null;
      this.emitStatus(false);

      if (!this.manualClose) {
        this.reconnect();
      }
    };
  }

  reconnect() {
    if (this.reconnectTimer || this.manualClose) return;

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 10000);

    this.reconnectAttempts++;

    console.log(`Reconnecting in ${delay}ms...`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  startHeartbeat() {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) return;

      this.send({
        type: "ping",
      });
    }, 25000);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("❌ WebSocket is not connected");
      return false;
    }

    try {
      this.ws.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("WebSocket send failed:", error);
      return false;
    }
  }

  onMessage(listener) {
    this.messageListeners.add(listener);

    return () => {
      this.messageListeners.delete(listener);
    };
  }

  onStatus(listener) {
    this.statusListeners.add(listener);

    return () => {
      this.statusListeners.delete(listener);
    };
  }

  emitStatus(status) {
    this.statusListeners.forEach((listener) => {
      listener(status);
    });
  }

  disconnect() {
    this.manualClose = true;

    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;

    this.stopHeartbeat();

    if (this.ws) {
      const ws = this.ws;
      this.ws = null;

      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close(1000, "Client disconnected");
      }
    }

    this.emitStatus(false);
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export default new MessageApi();
