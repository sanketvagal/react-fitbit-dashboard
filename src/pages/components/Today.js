import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import ProgressRing from "./figs/ProgressRing";

export default function Today({ token }) {
  const [activityData, setActivityData] = useState(null);
  const BASE_URL = "https://api.fitbit.com/1/user/-/activities";
  const endpoints = {
    dailyGoals: `${BASE_URL}/goals/daily.json`,
    todaySteps: `${BASE_URL}/steps/date/today/1d.json`,
    // todayCalories: `${BASE_URL}/calories/date/today/1d.json`,
    todayDistance: `${BASE_URL}/distance/date/today/1d.json`,
    todayFloors: `${BASE_URL}/floors/date/today/1d.json`,
    //   todayMinutesSedentary: `${BASE_URL}/minutesSedentary/date/today/1d.json`,
    //   todayMinutesVeryActive: `${BASE_URL}/minutesVeryActive/date/today/1d.json`,
  };

  useEffect(() => {
    if (token) {
      fetchData(token, endpoints).then((data) => setActivityData(data));
    }
  }, [token]);

  useEffect(() => {
    console.log("Component has re-rendered");
  });

  // if (activityData) {
  //   console.log("activityData", activityData);
  // }
  function extractGoalsAndValues(activityData) {
    let goals = {};
    let activityValues = {};

    if (activityData) {
      activityData.forEach((item) => {
        if (item.goals) {
          // check for goals
          goals = { ...goals, ...item.goals };
        } else {
          // check for today values
          for (let key in item) {
            if (item[key] instanceof Array) {
              item[key].forEach((activity) => {
                activityValues[key.replace("activities-", "")] = activity.value;
              });
            }
          }
        }
      });
    }

    return { goals, activityValues };
  }

  const { goals, activityValues } = extractGoalsAndValues(activityData);

  console.log("goals", goals);
  console.log("values", activityValues);

  /*...*/
  const [displayPercentage, setDisplayPercentage] = useState({});

  const handleMouseEnter = (key) => {
    setDisplayPercentage((prevState) => ({ ...prevState, [key]: true }));
  };

  const handleMouseLeave = (key) => {
    setDisplayPercentage((prevState) => ({ ...prevState, [key]: false }));
  };

  return (
    <div>
      Today {token}
      {activityData ? (
        <div>
          <h4>Activity Data:</h4>
          <pre>{JSON.stringify(activityData, null, 2)}</pre>
          {Object.keys(activityValues).map((key) => (
            <div key={key}>
              <h4>{key}</h4>
              <p>Goal: {goals[key]}</p>
              <p>Activity Value: {activityValues[key]}</p>
              <p>
                {" "}
                {displayPercentage[key]
                  ? `${((activityValues[key] / goals[key]) * 100).toFixed(
                      2
                    )}% out of ${goals[key]}`
                  : `${activityValues[key]} ${key} done out of ${goals[key]}`}
              </p>
              <div
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={() => handleMouseLeave(key)}
              >
                <ProgressRing
                  value={activityValues[key]}
                  goal={key}
                  goalValue={goals[key]}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading activity data...</p>
      )}
    </div>
  );
}
