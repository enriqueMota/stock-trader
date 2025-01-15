import React from "react";
import { Card, Text } from "@mantine/core";
import useStockStore from "../store";

const TopCards: React.FC = () => {
  const { stocks } = useStockStore();

  return (
    <>
      {stocks.map((stock) => {
        const { symbol, currentPrice, alertPrice, percentageChange } = stock;
        const isAboveAlert = currentPrice >= alertPrice;

        return (
          <Card
            key={symbol}
            shadow="sm"
            p="lg"
            style={{
              backgroundColor: isAboveAlert ? "lightgreen" : "lightcoral",
              marginBottom: "1rem",
            }}
          >
            <Text fw={700}>{symbol}</Text>
            <Text>Current: {currentPrice.toFixed(2)}</Text>
            <Text>Change: {percentageChange.toFixed(2)}%</Text>
            <Text>Alert: {alertPrice.toFixed(2)}</Text>
          </Card>
        );
      })}
    </>
  );
};

export default TopCards;
