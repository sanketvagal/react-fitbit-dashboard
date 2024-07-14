import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import RHRChart from "./figs/RHRChart";
import styles from "./RHRMonth.module.css";
import moment from "moment";

export default function RHRMonth({ token }) {
  const [rhrData, setRhrData] = useState(null);
  const [sleepData, setSleepData] = useState(null);

  const BASE_URL = "https://api.fitbit.com/1/user/-";
  const today = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];

  const endpoints = {
    sleep: `${BASE_URL}/sleep/date/${formatDate(today)}.json`,
  };

  useEffect(() => {
    if (token) {
      fetchData(token, endpoints).then((data) => setSleepData(data));
    }
  }, [token]);

  useEffect(() => {
    if (sleepData) {
      console.log("Sleep data", sleepData);
    }
  }, [sleepData]);

  return (
    <div>
      {sleepData ? (
        <div className={styles.box}>
          <h3>Sleep data</h3>
          <p>{JSON.stringify(sleepData)}</p>
        </div>
      ) : (
        <p>Loading activity data...</p>
      )}
    </div>
  );
}
