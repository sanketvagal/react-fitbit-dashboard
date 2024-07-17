import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
// import styles from "./RHRMonth.module.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale
);

const customSleepStageOrder = ["deep", "light", "rem", "wake"];

const sleepStageMap = customSleepStageOrder.reduce((acc, stage, index) => {
  acc[stage] = index;
  return acc;
}, {});

export default function SleepChart({ token }) {
  const [sleepData, setSleepData] = useState(null);
  const [sleepStagesOverTime, setSleepStagesOverTime] = useState([]);

  const BASE_URL = "https://api.fitbit.com/1.2/user/-";
  const today = new Date();
  const formatDate = (date) => date.toLocaleDateString("en-CA");
  const endpoints = {
    sleep: `${BASE_URL}/sleep/date/${formatDate(today)}.json`,
  };

  useEffect(() => {
    if (token) {
      fetchData(token, endpoints).then((data) => {
        setSleepData(data);
        const sleepLevels = data[0].sleep[0].levels.data;
        const sleepStages = sleepLevels.map((entry) => ({
          x: new Date(entry.dateTime),
          y: sleepStageMap[entry.level],
        }));

        setSleepStagesOverTime(sleepStages);
      });
    }
  }, [token]);

  const chartData = {
    datasets: [
      {
        label: "Sleep Stage",
        data: sleepStagesOverTime,
        fill: false,
        segment: {
          borderColor: "blue",
        },
        borderWidth: 2,
        tension: 0.1,
        stepped: true,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
        },
      },
      y: {
        type: "linear",
        ticks: {
          callback: (value) => customSleepStageOrder[value],
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      {sleepData ? (
        <div>
          <h3>Sleep Data</h3>
          <Line data={chartData} options={chartOptions} />
          <h5>
            Total hours asleep:{" "}
            {Math.floor(sleepData[0].summary.totalMinutesAsleep / 60)} hours{" "}
            {sleepData[0].summary.totalMinutesAsleep % 60} minutes
          </h5>
        </div>
      ) : (
        <p>Loading sleep data...</p>
      )}
    </div>
  );
}
