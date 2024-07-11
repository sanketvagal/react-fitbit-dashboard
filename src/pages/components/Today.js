import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import ProgressRing from "./figs/ProgressRing";
import styles from "./Today.module.css";

export default function Today({ token }) {
  const [activityData, setActivityData] = useState(null);
  const [todayGoals, setTodayGoals] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [displayPercentage, setDisplayPercentage] = useState({});

  const BASE_URL = "https://api.fitbit.com/1/user/-/activities";
  const endpoints = {
    dailyActivities: `${BASE_URL}/date/today.json`,
  };

  function mapTodayData(todayGoals, todayActivity) {
    if (!todayGoals) {
      return null;
    }
    const todayData = {};

    Object.keys(todayGoals).forEach((key) => {
      if (key === "distance") {
        // Map to total distance from distances array
        const totalDistance =
          todayActivity.distances.find((d) => d.activity === "total")
            ?.distance || 0;
        todayData[key] = totalDistance;
      } else if (key === "activeMinutes") {
        // Map to veryActiveMinutes
        todayData[key] = todayActivity.veryActiveMinutes;
      } else {
        // For other keys, use the value directly from todayActivity
        todayData[key] = todayActivity[key];
      }
    });
    // console.log("todayData", todayData);
    return todayData;
  }
  useEffect(() => {
    if (token) {
      fetchData(token, endpoints).then((data) => setActivityData(data));
    }
  }, [token]);

  useEffect(() => {
    if (activityData) {
      setTodayGoals(activityData[0].goals);
      setTodayData(mapTodayData(todayGoals, activityData[0].summary));
      // console.log("activityData", activityData);
      // console.log("todayGoals", todayGoals);
    }
  }, [activityData]);

  const handleMouseEnter = (key) => {
    setDisplayPercentage((prevState) => ({ ...prevState, [key]: true }));
  };

  const handleMouseLeave = (key) => {
    setDisplayPercentage((prevState) => ({ ...prevState, [key]: false }));
  };

  return (
    <div>
      {todayData ? (
        <div>
          <h3>Today</h3>
          <div className={styles.box}>
            {Object.keys(todayGoals).map((key) => (
              <div
                key={key}
                className={key == "steps" ? styles.favourite : styles.item}
              >
                <div
                  onMouseEnter={() => handleMouseEnter(key)}
                  onMouseLeave={() => handleMouseLeave(key)}
                >
                  <ProgressRing
                    className={styles.progressRing}
                    value={todayData[key]}
                    goalValue={todayGoals[key]}
                    goal={key}
                  />
                  <p>
                    {displayPercentage[key]
                      ? `${((todayData[key] / todayGoals[key]) * 100).toFixed(
                          0
                        )}% out of ${todayGoals[key]}`
                      : `${todayData[key]} ${key} done out of ${todayGoals[key]}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading activity data...</p>
      )}
    </div>
  );
}
