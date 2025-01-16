import React from "react";
import { Group, Box, Text, Divider } from "@mantine/core";
import useStockStore from "../store";

const TopCards: React.FC = () => {
  const { defaultStocks } = useStockStore();
  return (
    <Group gap="xl" justify="space-around" style={{ width: "100%" }}>
      {defaultStocks.map((stock) => {
        const { symbol, currentPrice, percentageChange } = stock;

        const difference = (percentageChange / 100) * currentPrice;
        const isPositive = difference > 0;
        const arrow = isPositive ? "↑" : "↓";
        const changeColor = isPositive ? "#00ff00" : "#ff4d4d";

        return (
          <Box
            key={symbol}
            style={{
              // width: "9rem", // or adjust as needed
              // backgroundColor: "#2e2e2e",
              borderRadius: 4,
              padding: "8px",
              margin: "4px",
            }}
          >
            <Group gap="xs" justify="space-between">
              <Text size="sm" fw={500}>
                {symbol}
              </Text>
              <Text size="sm" fw={500}>
                {currentPrice.toFixed(4)}
              </Text>
            </Group>
            <Box mt={4}>
              <Text size="sm" c={changeColor}>
                {arrow} {percentageChange.toFixed(4)}% ({difference.toFixed(4)})
              </Text>
            </Box>
            <Divider variant="vertical" />
          </Box>
        );
      })}
    </Group>
  );
};

export default TopCards;
