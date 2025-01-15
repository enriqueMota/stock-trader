import React from "react";
import { useForm } from "@mantine/form";
import { Button, Select, NumberInput, Box } from "@mantine/core";
import useStockStore from "../store";
import socketService from "../service";

interface FormValues {
  symbol: string;
  alertPrice: number;
}

const stockOptions = [
  { value: "AAPL", label: "Apple (AAPL)" },
  { value: "TSLA", label: "Tesla (TSLA)" },
  { value: "MSFT", label: "Microsoft (MSFT)" },
  // add more or fetch from an API
];

const LeftForm: React.FC = () => {
  const { addStock } = useStockStore();
  const { subscribeToSymbol } = socketService;

  const form = useForm<FormValues>({
    initialValues: {
      symbol: "AAPL",
      alertPrice: 100,
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
      <Select
        label="Select a stock"
        placeholder="Pick one"
        data={stockOptions}
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
    </Box>
  );
};

export default LeftForm;
