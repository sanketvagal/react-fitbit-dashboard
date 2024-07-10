import React, { useEffect, useState } from "react";
import { fetchData } from "./api";

export default function Badges({ token }) {
  const [badges, setBadges] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const BASE_URL = "https://api.fitbit.com/1/user/-/badges.json";

  const endpoints = {
    dailyActivities: `${BASE_URL}`,
  };

  useEffect(() => {
    if (token) {
      console.log("fetching badges");
      fetchData(token, endpoints).then((data) => setBadges(data[0].badges));
    }
  }, [token]);

  useEffect(() => {
    if (badges) {
      //   console.log("fetching badges", badges);
    }
  }, [badges]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % badges.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + badges.length) % badges.length
    );
  };
  return (
    <div>
      {badges ? (
        <div>
          <h3>Badges</h3>

          <div key={currentIndex}>
            <img
              src={badges[currentIndex].image100px}
              alt={badges[currentIndex].shortName}
            />

            <p>Category: {badges[currentIndex].category}</p>
            <p>Short name: {badges[currentIndex].shortName}</p>
            <p>Date Achieved: {badges[currentIndex].dateTime}</p>
            <p>Description: {badges[currentIndex].description}</p>
            <hr />
          </div>
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === badges.length - 1}
          >
            Next
          </button>
        </div>
      ) : (
        <p>Loading activity data...</p>
      )}
    </div>
  );
}
