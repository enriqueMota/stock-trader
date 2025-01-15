import React from "react";
import useStockStore from "../store";
import { Group, Badge } from "@mantine/core";

const TopCards: React.FC = () => {
  const { stocks } = useStockStore();

  return (
    <Group gap="xl" style={{ width: "100%" }}>
      {stocks.map((stock) => {
        const { symbol, currentPrice, alertPrice } = stock;
        const isAboveAlert = currentPrice >= alertPrice;
        return (
          <Badge
            key={symbol}
            variant="dot"
            color={isAboveAlert ? "green" : "red"}
            size="xl"
          >
            {symbol}: ${currentPrice.toFixed(2)}
          </Badge>
        );
      })}
    </Group>
  );
};

export default TopCards;
