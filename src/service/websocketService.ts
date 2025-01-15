const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
const FINNHUB_SOCKET_URL = `wss://ws.finnhub.io?token=${apiKey}`;

let socket: WebSocket | null = null;

function initWebsocket(onMessage: (data: unknown) => void) {
  socket = new WebSocket(FINNHUB_SOCKET_URL);

  socket.onopen = () => {
    console.log("[WebSocket] Connected to Finnhub");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data?.data) {
      onMessage(data.data);
    }
  };

  socket.onclose = () => {
    console.log("[WebSocket] Disconnected from Finnhub");
    socket = null;
  };
}

function subscribeToSymbol(symbol: string) {
  socket?.send(JSON.stringify({ type: "subscribe", symbol }));
}

function unsubscribeFromSymbol(symbol: string) {
  socket?.send(JSON.stringify({ type: "unsubscribe", symbol }));
}

export default {
  initWebsocket,
  subscribeToSymbol,
  unsubscribeFromSymbol,
};
