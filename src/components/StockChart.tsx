import React, { useMemo } from "react";
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
import getRandomColor from "../utils/colors";
import { Badge, Flex } from "@mantine/core";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale
);

const StockChart: React.FC = () => {
  const { stocks, stockHistory } = useStockStore();

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    stocks.forEach((s) => {
      if (!map[s.symbol]) {
        map[s.symbol] = getRandomColor();
      }
    });
    return map;
  }, [stocks]);

  const datasets = stocks.map((s) => {
    const history = stockHistory[s.symbol] || [];

    return {
      label: s.symbol,
      data: history.map((point) => ({
        x: new Date(point.time),
        y: point.price,
      })),
      borderColor: colorMap[s.symbol] || "#888",
      backgroundColor: colorMap[s.symbol] || "#888",
      tension: 0.1,
    };
  });

  const data = {
    datasets,
  };

  const options = {
    responsive: true,
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
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return (
    <Flex direction="column" gap="md" w="100%">
      <Line data={data} options={options} />
      <Flex align="center" w="100%" direction="row" gap="md">
        {stocks.map(({ symbol, currentPrice }) => (
          <Badge key={symbol} variant="dot" color="blue" size="lg">
            {symbol}: ${currentPrice.toFixed(2)}
          </Badge>
        ))}
      </Flex>
    </Flex>
  );
};

export default StockChart;
