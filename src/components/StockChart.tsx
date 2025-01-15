import React from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import useStockStore from "../store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale
);

const COLORS = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffa500",
  // ...
];

const StockChart: React.FC = () => {
  const { stocks, stockHistory } = useStockStore();

  const datasets = stocks.map((s, index) => {
    const history = stockHistory[s.symbol] || [];
    const color = COLORS[index % COLORS.length];
    return {
      label: s.symbol,
      data: history.map((point) => ({
        x: new Date(point.time),
        y: point.price,
      })),
      borderColor: color,
      backgroundColor: color,
      tension: 0.1,
    };
  });

  const data = {
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "minute",
        },
      },
      y: {
        beginAtZero: false,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return <Line data={data} options={options} />;
};

export default StockChart;
