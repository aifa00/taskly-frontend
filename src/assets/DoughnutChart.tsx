// DonutChart.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartType {
  data: any;
}

const DoughnutChart: React.FC<DoughnutChartType> = ({ data }) => {
  // Chart data
  const chartData = {
    labels: ["Pending", "Completed", "Blocked", "In Progress"],
    datasets: [
      {
        data: [data.pending, data.completed, data.blocked, data["in-progress"]],
        backgroundColor: [
          "#FFC107", // Amber for Pending
          "#4CAF50", // Emerald for Completed
          "#D81B60", // Deep Rose for Blocked
          "#3F51B5", // Indigo for In Progress
        ],
        hoverBackgroundColor: [
          "#FFB300", // Darker Amber for Pending
          "#388E3C", // Darker Emerald for Completed
          "#AD1457", // Darker Deep Rose for Blocked
          "#303F9F", // Darker Indigo for In Progress
        ],

        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.label || "";
            if (label) label += ": ";
            label += context.raw;
            return label;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "300px", margin: "0 auto" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
