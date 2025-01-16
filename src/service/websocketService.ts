export const apiKey = import.meta.env.VITE_FINNHUB_KEY;

const FINNHUB_SOCKET_URL = `wss://ws.finnhub.io?token=${apiKey}`;

export interface FinnhubTrade {
  p: number; // price
  s: string; // symbol
  t: number; // timestamp (ms)
  v: number; // volume
}

let socket: WebSocket | null = null;

/**
 * Initialize the WebSocket and attach a callback for 'trade' data.
 *
 * @param onTradeData Callback that receives an array of FinnhubTrade objects
 */
const initWebsocket = (onTradeData: (tradeData: FinnhubTrade[]) => void) => {
  socket = new WebSocket(FINNHUB_SOCKET_URL);

  socket.onopen = () => {
    console.log("[WebSocket] Connected to Finnhub");

    // Subscribing to default symbols for TopCards
    socket?.send(
      JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" })
    );
    socket?.send(JSON.stringify({ type: "subscribe", symbol: "AAPL" }));
    socket?.send(JSON.stringify({ type: "subscribe", symbol: "IC MARKETS:1" }));
    socket?.send(JSON.stringify({ type: "subscribe", symbol: "MSFT" }));
    socket?.send(JSON.stringify({ type: "subscribe", symbol: "TSLA" }));
    socket?.send(JSON.stringify({ type: "subscribe", symbol: "NVDA" }));
    socket?.send(JSON.stringify({ type: "subscribe", symbol: "AMZN" }));
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "trade" && message.data) {
      onTradeData(message.data);
    }
  };

  socket.onclose = () => {
    console.log("[WebSocket] Disconnected from Finnhub");
    socket = null;
  };
};

/**
 * Subscribe to a new symbol at runtime
 */
const subscribeToSymbol = (symbol: string) => {
  socket?.send(JSON.stringify({ type: "subscribe", symbol }));
};

/**
 * Unsubscribe from a symbol
 */
const unsubscribeFromSymbol = (symbol: string) => {
  socket?.send(JSON.stringify({ type: "unsubscribe", symbol }));
};

export default {
  initWebsocket,
  subscribeToSymbol,
  unsubscribeFromSymbol,
};
