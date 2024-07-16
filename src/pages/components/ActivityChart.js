import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import BarChart from "./figs/BarChart";
import moment from "moment";
export default function ActivityChart({ token }) {
  const [stat, setStat] = useState("Steps");
  const [dateRange, setDateRange] = useState("1 Month");
  const [data, setData] = useState(null);
  const [steps, setSteps] = useState(null);
  const [calories, setCalories] = useState(null);
  const [distance, setDistance] = useState(null);
  const [floors, setFloors] = useState(null);
  const [activeMinutes, setActiveMinutes] = useState(null);
  const [average, setAverage] = useState(0);
  const [maxDay, setMaxDay] = useState("");

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

  const formatDate = (date) => date.toISOString().split("T")[0];

  const BASE_URL = "https://api.fitbit.com/1/user/-/activities";
  const endpoints = {
    steps: `${BASE_URL}/steps/date/${formatDate(
      getDateRange(dateRange)
    )}/${formatDate(today)}.json`,
    calories: `${BASE_URL}/calories/date/${formatDate(
      getDateRange(dateRange)
    )}/${formatDate(today)}.json`,
    distance: `${BASE_URL}/distance/date/${formatDate(
      getDateRange(dateRange)
    )}/${formatDate(today)}.json`,
    floors: `${BASE_URL}/floors/date/${formatDate(
      getDateRange(dateRange)
    )}/${formatDate(today)}.json`,
    activeMinutes: `${BASE_URL}/minutesFairlyActive/date/${formatDate(
      getDateRange(dateRange)
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
      setDistance(data[2]["activities-distance"]);
      setFloors(data[3]["activities-floors"]);
      setActiveMinutes(data[4]["activities-minutesFairlyActive"]);
    }
  }, [data]);

  useEffect(() => {
    const calculateStats = (activity) => {
      if (activity && activity.length > 0) {
        const values = activity.map((item) => parseInt(item.value));
        const avg = Math.round(
          values.reduce((a, b) => a + b, 0) / values.length
        );
        const maxVal = Math.max(...values);
        const maxDayIndex = values.indexOf(maxVal);
        const maxDay = moment(activity[maxDayIndex].dateTime).format("MMM DD");
        return { avg, maxDay };
      }
      return { avg: 0, maxDay: "" };
    };

    let result;
    switch (stat) {
      case "Steps":
        result = calculateStats(steps);
        break;
      case "Calories":
        result = calculateStats(calories);
        break;
      case "Distance":
        result = calculateStats(distance);
        break;
      case "Floors":
        result = calculateStats(floors);
        break;
      case "Active Minutes":
        result = calculateStats(activeMinutes);
        break;
      default:
        result = { avg: 0, maxDay: "" };
    }

    setAverage(result.avg);
    setMaxDay(result.maxDay);
  }, [steps, calories, distance, floors, activeMinutes, stat]);

  const handleStatChange = (e) => {
    setStat(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  return (
    <div>
      <h3>Activity Chart</h3>
      <div>
        <label htmlFor="stat-select">Select Statistic: </label>
        <select id="stat-select" value={stat} onChange={handleStatChange}>
          <option value="Steps">Steps</option>
          <option value="Calories">Calories</option>
          <option value="Distance">Distance</option>
          <option value="Floors">Floors</option>
          <option value="Active Minutes">Active Minutes</option>
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
      {steps && calories && distance && floors && activeMinutes ? (
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
          {stat === "Distance" && (
            <BarChart
              label={"Distance"}
              activity={distance}
              color={"#66CC66"}
            />
          )}
          {stat === "Floors" && (
            <BarChart label={"Floors"} activity={floors} color={"#FF6666"} />
          )}
          {stat === "Active Minutes" && (
            <BarChart
              label={"Active Minutes"}
              activity={activeMinutes}
              color={"#FF9966"}
            />
          )}
          <div>
            <p>
              {dateRange} Average for {stat}: {average}
            </p>
            <p>
              Day with Max {stat}: {maxDay}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
