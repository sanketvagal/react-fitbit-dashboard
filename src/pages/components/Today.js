import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import ProgressRing from "./figs/ProgressRing";

export default function Today({ token }) {
  const [activityData, setActivityData] = useState(null);
  const [todayGoals, setTodayGoals] = useState(null);
  const [todayData, setTodayData] = useState(null);

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

    return todayData;
  }
  useEffect(() => {
    if (token) {
      fetchData(token, endpoints).then((data) => setActivityData(data));
    }
  }, [token]);

  useEffect(() => {
    console.log("Component has re-rendered");
  });

  useEffect(() => {
    if (activityData) {
      setTodayGoals(activityData[0].goals);
      setTodayData(mapTodayData(todayGoals, activityData[0].summary));
      console.log("activityData", activityData);
      console.log("todayData", todayData);
      console.log("todayGoals", todayGoals);
    }
  }, [activityData]);
  const [displayPercentage, setDisplayPercentage] = useState({});

  const handleMouseEnter = (key) => {
    setDisplayPercentage((prevState) => ({ ...prevState, [key]: true }));
  };

  const handleMouseLeave = (key) => {
    setDisplayPercentage((prevState) => ({ ...prevState, [key]: false }));
  };
  return (
    <div>
      {activityData && todayGoals && todayData ? (
        <div>
          <h4>Activity Data:</h4>
          <pre>{JSON.stringify(todayGoals, null, 2)}</pre>
          <pre>{JSON.stringify(todayData, null, 2)}</pre>
          <h4>Today Activity values for Today Goals keys:</h4>
          {Object.keys(todayGoals).map((key) => (
            <div key={key}>
              <div
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={() => handleMouseLeave(key)}
              >
                <ProgressRing
                  value={todayData[key]}
                  goalValue={todayGoals[key]}
                  goal={key}
                />
              </div>
              <p>
                {" "}
                {displayPercentage[key]
                  ? `${((todayData[key] / todayGoals[key]) * 100).toFixed(
                      2
                    )}% out of ${todayGoals[key]}`
                  : `${todayData[key]} ${key} done out of ${todayGoals[key]}`}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading activity data...</p>
      )}
    </div>
  );
}
