import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProgressRing = ({ value, goal, goalValue }) => {
  return (
    <div style={{ width: 100, height: 100 }}>
      <CircularProgressbar
        value={value}
        maxValue={goalValue}
        text={`${value} ${goal}`}
        styles={buildStyles({
          pathColor: "#f8b26a",
          trailColor: "#d6d6d6",
          textColor: "#000",
        })}
      />
    </div>
  );
};

export default ProgressRing;
