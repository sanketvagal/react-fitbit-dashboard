import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ label, activity, color }) => {
  const dates = activity.map((entry) =>
    moment(entry.dateTime).format("MMM DD")
  );
  const values = activity.map((entry) => parseInt(entry.value, 10));

  const data = {
    labels: dates,
    datasets: [
      {
        label: label,
        data: values,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: label,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
