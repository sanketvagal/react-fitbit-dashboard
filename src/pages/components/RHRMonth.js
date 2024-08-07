import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import RHRChart from "./figs/RHRChart";
// import styles from "./RHRMonth.module.css";
import moment from "moment";

const processHeartRateData = (rhrData) => {
  let lastValidHeartRate = null;
  const restingHeartRates = rhrData
    .map((item) =>
      item["activities-heart"].map((activity) => {
        if (activity.value.restingHeartRate) {
          lastValidHeartRate = activity.value.restingHeartRate;
          return lastValidHeartRate;
        } else {
          return lastValidHeartRate;
        }
      })
    )
    .flat();
  const dateTimes = rhrData
    .map((item) =>
      item["activities-heart"].map((activity) => activity.dateTime)
    )
    .flat();
  return { restingHeartRates, dateTimes };
};

const generateChartData = (restingHeartRates, dateTimes) => {
  const formattedDates = dateTimes.map((date) => moment(date).format("MMM DD"));

  return {
    labels: formattedDates,
    datasets: [
      {
        label: "Resting Heart Rate",
        data: restingHeartRates,
        borderColor: "red",
        backgroundColor: "red",
        tension: 0.5,
      },
    ],
  };
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
  plugins: {
    legend: {
      display: false,
    },
  },
};

export default function RHRMonth({ token }) {
  const [rhrData, setRhrData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [todayRHR, setTodayRHR] = useState(null);

  const BASE_URL = "https://api.fitbit.com/1/user/-/activities";
  const today = new Date();
  const oneMonthAgo = new Date(new Date().setMonth(today.getMonth() - 1));
  const formatDate = (date) => date.toLocaleDateString("en-CA");

  const endpoints = {
    dailyActivities: `${BASE_URL}/heart/date/${formatDate(
      oneMonthAgo
    )}/${formatDate(today)}.json`,
  };

  useEffect(() => {
    if (token) {
      fetchData(token, endpoints).then((data) => setRhrData(data));
    }
  }, [token]);

  useEffect(() => {
    if (rhrData) {
      setTodayRHR(
        rhrData[0]["activities-heart"][
          rhrData[0]["activities-heart"].length - 1
        ]["value"]["restingHeartRate"]
      );
      const { restingHeartRates, dateTimes } = processHeartRateData(rhrData);
      const chartData = generateChartData(restingHeartRates, dateTimes);
      setChartData(chartData);
    }
  }, [rhrData]);

  return (
    <div>
      {rhrData ? (
        <div>
          <h3>Resting Heart Rate Over Time</h3>
          {chartData && <RHRChart chartData={chartData} options={options} />}
          <h5> Today's Resting heart rate: {todayRHR}</h5>
        </div>
      ) : (
        <p>Loading activity data...</p>
      )}
    </div>
  );
}
