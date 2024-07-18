import { useState } from "react";
import { Button, Collapse, Dropdown, Flex, Radio } from "antd";
import type { CollapseProps, MenuProps } from "antd";
import Chart from "react-apexcharts";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import SelectDashboard from "./SelectDashboard";

const chartData = [
  {
    name: "1982",
    data: [10, 20, 40],
  },
  {
    name: "1990",
    data: [18, 34, 32],
  },
  {
    name: "1992",
    data: [25, 35, 52],
  },
];

const chart = {
  options: {
    chart: {
      id: "stacked-bar",
      stacked: true,
      stackedType: "100%",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 1,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#6B47FF", "#aa98f5", "#F0F3F5"],
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: [1980, 1981, 1982],
      labels: {
        style: {
          colors: ["#D9E1E7", "#D9E1E7", "#D9E1E7"],
        },
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "44px",
      },
    },
  },
  series: chartData,
};

const codeString = `SELECT COUNT(*) FROM employees WHERE status = 'active';`;

const sqlItems: CollapseProps["items"] = [
  {
    key: "1",
    label: <p className="sql-heading">Show SQL</p>,
    children: (
      <SyntaxHighlighter
        language="sql"
        wrapLongLines
        style={a11yDark}
        customStyle={{ padding: "20px", borderRadius: "8px" }}
      >
        {codeString}
      </SyntaxHighlighter>
    ),
  },
];

const addMenuItems: MenuProps["items"] = [
  {
    label: <SelectDashboard dropdown={true} />,
    key: "0",
    disabled: true,
    className: "select-dashboard-dropdown",
  },
];

const TotalActiveEmployees = () => {
  const [chartType, setChartType] = useState<"area" | "bar" | "line">("bar");

  return (
    <Flex vertical gap={15} className="active-employees-container">
      <p>Total Active Employees</p>

      <div className="icons-container">
        <img
          role="button"
          src="/line-chart.svg"
          alt="Line chart icon"
          onClick={() => setChartType("line")}
        />
        <img
          role="button"
          src="/sheet.svg"
          alt="sheet chart icon"
          onClick={() => setChartType("area")}
        />
        <img
          role="button"
          src="/bar.svg"
          alt="Bar chart icon"
          onClick={() => setChartType("bar")}
        />
        <img src="/save.svg" alt="save icon" />
        <Dropdown
          menu={{ items: addMenuItems }}
          trigger={["click"]}
          placement="bottom"
          arrow={{ pointAtCenter: true }}
        >
          <img src="/add.svg" alt="add icon" className="base" />
        </Dropdown>
      </div>

      <div>
        <Chart
          key={chartType}
          options={chart.options}
          series={chart.series}
          type={chartType}
        />
      </div>

      <div className="count-employee-container">
        <Radio>Count of Employees</Radio>
        <div>
          <img src="/like.svg" alt="like" />
          <img src="/dislike.svg" alt="dislike" />
        </div>
      </div>

      <Collapse ghost items={sqlItems} expandIconPosition="end" />

      <Button className="verification-btn">Send Verification</Button>
    </Flex>
  );
};

export default TotalActiveEmployees;
