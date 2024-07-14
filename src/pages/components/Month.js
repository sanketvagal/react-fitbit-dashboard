import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import BarChart from "./figs/BarChart";
export default function Month({ token }) {
  const [stat, setStat] = useState(null);
  const [data, setData] = useState(null);
  const [steps, setSteps] = useState(null);
  const [calories, setCalories] = useState(null);
  const today = new Date();
  const oneMonthAgo = new Date(new Date().setMonth(today.getMonth() - 1));
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
  }, [token]);

  useEffect(() => {
    if (data) {
      console.log("data", data);
      console.log("steps", data[0]["activities-steps"]);
      console.log("calories", data[1]["activities-calories"]);
      setSteps(data[0]["activities-steps"]);
      setCalories(data[1]["activities-calories"]);
    }
  }, [data]);

  return (
    <div>
      <h3>Month</h3>
      {steps ? (
        // <div>{JSON.stringify(steps)}</div>
        <div>
          <BarChart label={"Steps"} activity={steps} color={"#4cc2c4"} />
          <BarChart label={"Calories"} activity={calories} color={"#FFB347"} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
