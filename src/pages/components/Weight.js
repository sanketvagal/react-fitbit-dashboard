import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import LineChart from "./figs/LineChart";

export default function Weight({ token }) {
  const [weightData, setWeightData] = useState(null);
  const today = new Date();

  const oneMonthAgo = new Date(new Date().setMonth(today.getMonth() - 1));

  const formatDate = (date) => date.toISOString().split("T")[0];

  const BASE_URL = "https://api.fitbit.com/1/user/-/body";
  const endpoints = {
    weight: `${BASE_URL}/weight/date/${formatDate(oneMonthAgo)}/${formatDate(
      today
    )}.json`,
  };

  useEffect(() => {
    if (token) {
      fetchData(token, endpoints).then((data) => {
        setWeightData(data[0]["body-weight"]);
      });
    }
  }, [token]);

  useEffect(() => {
    if (weightData) {
      console.log("weightData", weightData);
    }
  }, [weightData]);

  return (
    <div>
      <h3>Weight Chart </h3>
      {weightData ? (
        <LineChart label={"Weight"} activity={weightData} color={"skyblue"} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
