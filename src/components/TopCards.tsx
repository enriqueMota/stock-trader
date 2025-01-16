import React from "react";
import { Group, Box, Text, Divider, NumberFormatter } from "@mantine/core";
import useStockStore from "../store";

const TopCards: React.FC = () => {
  const { defaultStocks } = useStockStore();
  return (
    <Group
      gap="xl"
      bg="#2e2e2e"
      justify="space-around"
      style={{ width: "100%" }}
    >
      {defaultStocks.map((stock) => {
        const { symbol, currentPrice, percentageChange } = stock;
        // Calculating the difference in price
        const difference = (percentageChange / 100) * currentPrice;
        const isPositive = difference > 0;
        const arrow = isPositive ? "↑" : "↓";
        const changeColor = isPositive ? "#00ff00" : "#ff4d4d";

        return (
          <Box
            key={symbol}
            style={{
              borderRadius: 4,
              padding: "8px",
              margin: "4px",
            }}
          >
            <Group gap="xs" justify="space-between">
              <Text size="sm" c="white" fw={500}>
                {symbol}
              </Text>
              <Text size="sm" c="white" fw={600}>
                <NumberFormatter
                  prefix="$ "
                  value={currentPrice}
                  thousandSeparator
                />
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
