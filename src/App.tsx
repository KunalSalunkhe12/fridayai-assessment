import { ConfigProvider, Flex } from "antd";
import TotalActiveEmployees from "./components/TotalActiveEmployees";
import MoveDashboardModal from "./components/MoveDashboardModal";
import ShareDashboardModal from "./components/ShareDashboardModal";

const App = () => {
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#8C71F9",
            fontFamily: "proxima-nova, sans-serif",
          },
        }}
      >
        <h5>Components</h5>
        <Flex gap={20} align="center" wrap style={{ padding: "10px" }}>
          <TotalActiveEmployees />
          <MoveDashboardModal />
          <ShareDashboardModal />
        </Flex>
      </ConfigProvider>
    </div>
  );
};

export default App;
