import { useEffect } from "react";
import { AppShell, Flex, Grid, MantineProvider } from "@mantine/core";
import useStockStore from "./store";
import webSocketService from "./service";
import LeftForm from "./components/LeftForm";
import TopCards from "./components/TopCards";
import StockChart from "./components/StockChart";
import { apiKey, FinnhubTrade } from "./service/websocketService";
import { finnhubClient, FinnhubProvider } from "react-finnhub";

const client = finnhubClient(apiKey);

function App() {
  const { updateStock, defaultStocks, updateDefaultStocks } = useStockStore();
  const { initWebsocket } = webSocketService;

  useEffect(() => {
    initWebsocket((tradeData: FinnhubTrade[]) => {
      for (let index = 0; index < tradeData.length; index++) {
        const trade = tradeData[index];
        if (defaultStocks.some((stock) => stock.symbol === trade.s)) {
          updateDefaultStocks(trade.s, trade.p);
          continue;
        } else {
          updateStock(trade.s, trade.p);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateStock, initWebsocket]);

  return (
    <MantineProvider>
      <FinnhubProvider client={client}>
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
                <Flex
                  justify="center"
                  align="center"
                  direction="column"
                  h="100%"
                >
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
      </FinnhubProvider>
    </MantineProvider>
  );
}

export default App;
