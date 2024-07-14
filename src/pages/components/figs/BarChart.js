import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ label, activity, color }) => {
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

  return <Bar data={data} options={options} />;
};

export default BarChart;
