import { create } from "zustand";

export interface StockDataPoint {
  time: number;
  price: number;
}

export interface StockInfo {
  symbol: string;
  currentPrice: number;
  percentageChange: number;
  alertPrice: number;
}

export interface StockState {
  stocks: StockInfo[];
  defaultStocks: StockInfo[];
  symbols: StockSymbol[];
  defaultStockHistory: Record<string, StockDataPoint[]>;
  stockHistory: Record<string, StockDataPoint[]>;
  addStock: (symbol: string, alertPrice: number) => void;
  updateStock: (symbol: string, newPrice: number) => void;
  updateDefaultStocks: (symbol: string, newPrice: number) => void;
  setAlertPrice: (symbol: string, alertPrice: number) => void;
  setPercentageChange: (symbol: string, percentageChange: number) => void;
  setStockSymbols: (symbols: StockSymbol[]) => void;
}

export interface StockSymbol {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  symbol: string;
  type: string;
}

const useStockStore = create<StockState>((set, get) => ({
  stocks: [],
  defaultStocks: [
    {
      symbol: "AAPL",
      currentPrice: 0,
      percentageChange: 0,
      alertPrice: 200,
    },
    {
      symbol: "BINANCE:BTCUSDT",
      currentPrice: 0,
      percentageChange: 0,
      alertPrice: 20000,
    },
    {
      symbol: "IC MARKETS:1",
      currentPrice: 0,
      percentageChange: 0,
      alertPrice: 100,
    },
    {
      symbol: "MSFT",
      currentPrice: 0,
      percentageChange: 0,
      alertPrice: 100,
    },
    {
      symbol: "TSLA",
      currentPrice: 0,
      percentageChange: 0,
      alertPrice: 100,
    },
    {
      symbol: "NVDA",
      currentPrice: 0,
      percentageChange: 0,
      alertPrice: 100,
    },
    {
      symbol: "AMZN",
      currentPrice: 0,
      percentageChange: 0,
      alertPrice: 100,
    },
  ],
  stockHistory: {},
  defaultStockHistory: {
    AAPL: [],
    "BINANCE:BTCUSDT": [],
    "IC MARKETS:1": [],
    MSFT: [],
    TSLA: [],
    NVDA: [],
    AMZN: [],
  },
  symbols: [],
  addStock: (symbol: string, alertPrice: number) => {
    const { stocks, stockHistory } = get();
    if (!stocks.find((s) => s.symbol === symbol)) {
      set({
        stocks: [
          ...stocks,
          { symbol, currentPrice: 0, percentageChange: 0, alertPrice },
        ],
        stockHistory: { ...stockHistory, [symbol]: [] },
      });
    }
  },
  updateStock: (symbol, newPrice) => {
    const { stocks, stockHistory } = get();
    // Update store
    const updatedStocks = stocks.map((s) => {
      if (s.symbol === symbol) {
        const oldPrice = s.currentPrice;
        const newPercentageChange =
          oldPrice === 0 ? 0 : ((newPrice - oldPrice) / oldPrice) * 100;

        return {
          ...s,
          currentPrice: newPrice,
          percentageChange: newPercentageChange,
        };
      }
      return s;
    });

    // Update historical data
    const now = Date.now();
    const updatedHistory = {
      ...stockHistory,
      [symbol]: [
        ...(stockHistory[symbol] || []),
        { time: now, price: newPrice },
      ],
    };

    set({ stocks: updatedStocks, stockHistory: updatedHistory });
  },
  updateDefaultStocks: (symbol, newPrice) => {
    const { defaultStocks, defaultStockHistory } = get();
    // Update store
    const updatedStocks = defaultStocks.map((s) => {
      if (s.symbol === symbol) {
        const oldPrice = s.currentPrice;
        const newPercentageChange =
          oldPrice === 0 ? 0 : ((newPrice - oldPrice) / oldPrice) * 100;

        return {
          ...s,
          currentPrice: newPrice,
          percentageChange: newPercentageChange,
        };
      }
      return s;
    });

    const now = Date.now();
    const updatedHistory = {
      ...defaultStockHistory,
      [symbol]: [
        ...(defaultStockHistory[symbol] || []),
        { time: now, price: newPrice },
      ],
    };

    set({ defaultStocks: updatedStocks, defaultStockHistory: updatedHistory });
  },

  setAlertPrice: (symbol, alertPrice) => {
    const { stocks } = get();
    const updatedStocks = stocks.map((s) =>
      s.symbol === symbol ? { ...s, alertPrice } : s
    );
    set({ stocks: updatedStocks });
  },

  setPercentageChange: (symbol, percentageChange) => {
    const { stocks } = get();
    const updatedStocks = stocks.map((s) =>
      s.symbol === symbol ? { ...s, percentageChange } : s
    );
    set({ stocks: updatedStocks });
  },
  setStockSymbols: (symbols) => set({ symbols }),
}));

export default useStockStore;
