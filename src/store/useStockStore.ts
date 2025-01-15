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
  stockHistory: Record<string, StockDataPoint[]>;
  addStock: (symbol: string, alertPrice: number) => void;
  updateStock: (symbol: string, newPrice: number) => void;
  setAlertPrice: (symbol: string, alertPrice: number) => void;
  setPercentageChange: (symbol: string, percentageChange: number) => void;
}

const useStockStore = create<StockState>((set, get) => ({
  stocks: [
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
      alertPrice: 100, // or whatever you like
    },
  ],
  stockHistory: {
    AAPL: [],
    "BINANCE:BTCUSDT": [],
    "IC MARKETS:1": [],
  },
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
}));

export default useStockStore;
