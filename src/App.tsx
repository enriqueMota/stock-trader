import { useEffect } from "react";
import { AppShell, Flex, Grid, MantineProvider } from "@mantine/core";
import useStockStore from "./store";
import webSocketService from "./service";
import LeftForm from "./components/LeftForm";
import TopCards from "./components/TopCards";
import StockChart from "./components/StockChart";
import { FinnhubTrade } from "./service/websocketService";

function App() {
  const { updateStock } = useStockStore();
  const { initWebsocket } = webSocketService;

  useEffect(() => {
    initWebsocket((tradeData: FinnhubTrade[]) => {
      tradeData.forEach((trade) => {
        updateStock(trade.s, trade.p);
      });
    });
  }, [updateStock, initWebsocket]);

  return (
    <MantineProvider>
      <AppShell header={{ height: 70 }}>
        <AppShell.Header
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <TopCards />
        </AppShell.Header>
        <AppShell.Main w="100vw">
          <Grid mt="5rem">
            <Grid.Col span={4}>
              <Flex justify="center" align="center" direction="column" h="100%">
                <LeftForm />
              </Flex>
            </Grid.Col>
            <Grid.Col span={7}>
              <Flex>
                <StockChart />
              </Flex>
            </Grid.Col>
          </Grid>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
