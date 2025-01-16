import React, { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Button, Select, NumberInput, Box, Flex } from "@mantine/core";
import useStockStore from "../store";
import socketService from "../service";
import { useFinnhub } from "react-finnhub";
import { StockSymbol } from "../store/useStockStore";

interface FormValues {
  symbol: string;
  alertPrice: number;
}

const LeftForm: React.FC = () => {
  const { addStock, setStockSymbols, symbols } = useStockStore();
  const { subscribeToSymbol } = socketService;
  const finnhub = useFinnhub();

  useEffect(() => {
    finnhub.stockSymbols("US").then(({ data }) => {
      const symbols = [];
      for (let index = 0; index < data.length; index++) {
        if (index >= 20) break;
        const element = data[index];
        symbols.push(element);
      }
      setStockSymbols(symbols as StockSymbol[]);
    });
  }, [setStockSymbols, finnhub]);

  const form = useForm<FormValues>({
    initialValues: {
      symbol: "",
      alertPrice: 0,
    },
    validate: {
      symbol: (value) => (value ? null : "Please select a symbol"),
      alertPrice: (value) =>
        value > 0 ? null : "Price must be greater than 0",
    },
  });

  const handleSubmit = (values: FormValues) => {
    addStock(values.symbol, values.alertPrice);
    subscribeToSymbol(values.symbol);
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Flex direction="column" gap="md" w="25rem">
        <Select
          label="Select a stock"
          placeholder="Pick one"
          data={symbols?.map((symbol) => ({
            value: symbol.symbol,
            label: `${symbol.description} (${symbol.symbol})`,
          }))}
          {...form.getInputProps("symbol")}
        />
        <NumberInput
          mt="sm"
          label="Alert Price"
          placeholder="Enter price"
          min={1}
          {...form.getInputProps("alertPrice")}
        />
        <Button type="submit" mt="md">
          Add
        </Button>
      </Flex>
    </Box>
  );
};

export default LeftForm;
