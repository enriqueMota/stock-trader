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
    // Fetching stock symbols for the select component
    finnhub.stockSymbols("US").then(({ data }) => {
      const symbols = [];
      for (let index = 0; index < data.length; index++) {
        // Limiting the number of symbols to 20
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
    form.reset();
  };

  return (
    <Box
      component="form"
      bd="1px solid gray"
      p="4rem"
      style={{ borderRadius: 4 }}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <Flex direction="column" gap="md" w="25rem">
        <Select
          label="Select a stock"
          placeholder="Pick one"
          data={[
            { label: "", value: "" },
            { label: "D-Wave Quantum (QBTS)", value: "QBTS" },
            { label: "Plug Power Inc. (PLUG)", value: "PLUG" },
            { label: "Vale S.A. Sponsored ADR (VALE)", value: "VALE" },
            { label: "DatChat, Inc. (DATS)", value: "DATS" },
            ...(symbols?.map((symbol) => ({
              value: symbol.symbol,
              label: `${symbol.description} (${symbol.symbol})`,
            })) ?? []),
          ]}
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
