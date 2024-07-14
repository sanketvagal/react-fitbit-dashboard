import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import BarChart from "./figs/BarChart";

export default function Month({ token }) {
  const [stat, setStat] = useState("Steps");
  const [dateRange, setDateRange] = useState("1 Month");
  const [data, setData] = useState(null);
  const [steps, setSteps] = useState(null);
  const [calories, setCalories] = useState(null);

  const today = new Date();
  const getDateRange = (range) => {
    const newDate = new Date();
    switch (range) {
      case "1 Week":
        return new Date(newDate.setDate(today.getDate() - 7));
      case "1 Year":
        return new Date(newDate.setFullYear(today.getFullYear() - 1));
      case "1 Month":
      default:
        return new Date(newDate.setMonth(today.getMonth() - 1));
    }
  };

  const oneMonthAgo = getDateRange(dateRange);
  const formatDate = (date) => date.toISOString().split("T")[0];

  const BASE_URL = "https://api.fitbit.com/1/user/-/activities";
  const endpoints = {
    steps: `${BASE_URL}/steps/date/${formatDate(oneMonthAgo)}/${formatDate(
      today
    )}.json`,
    calories: `${BASE_URL}/calories/date/${formatDate(
      oneMonthAgo
    )}/${formatDate(today)}.json`,
  };

  useEffect(() => {
    if (token) {
      fetchData(token, endpoints).then((data) => setData(data));
    }
  }, [token, dateRange]);

  useEffect(() => {
    if (data) {
      setSteps(data[0]["activities-steps"]);
      setCalories(data[1]["activities-calories"]);
    }
  }, [data]);

  const handleStatChange = (e) => {
    setStat(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  return (
    <div>
      <h3>Month</h3>
      <div>
        <label htmlFor="stat-select">Select Statistic: </label>
        <select id="stat-select" value={stat} onChange={handleStatChange}>
          <option value="Steps">Steps</option>
          <option value="Calories">Calories</option>
        </select>
      </div>
      <div>
        <label htmlFor="date-range-select">Select Date Range: </label>
        <select
          id="date-range-select"
          value={dateRange}
          onChange={handleDateRangeChange}
        >
          <option value="1 Month">1 Month</option>
          <option value="1 Week">1 Week</option>
          <option value="1 Year">1 Year</option>
        </select>
      </div>
      {steps && calories ? (
        <div>
          {stat === "Steps" && (
            <BarChart label={"Steps"} activity={steps} color={"#4cc2c4"} />
          )}
          {stat === "Calories" && (
            <BarChart
              label={"Calories"}
              activity={calories}
              color={"#FFB347"}
            />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
