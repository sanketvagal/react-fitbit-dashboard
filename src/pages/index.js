import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import LoginPage from "./components/LoginPage";

export default function Home() {
  const [token, setToken] = useState(null);
  const [activityData, setActivityData] = useState(null);

  const handleTokenChange = (newToken) => {
    setToken(newToken);
  };

  useEffect(() => {
    if (token) {
      fetchActivityData(token);
    }
  }, [token]);

  const fetchActivityData = async (token) => {
    try {
      const response = await axios.get(
        "https://api.fitbit.com/1.2/user/-/sleep/date/2023-01-01.json",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActivityData(response.data);
    } catch (error) {
      console.error("Error fetching activity data:", error);
    }
  };

  return (
    <React.StrictMode>
      {!token ? (
        <LoginPage onTokenChange={handleTokenChange} />
      ) : (
        <div>
          <h4>Token in Parent:</h4>
          <pre>{token}</pre>
          {activityData ? (
            <div>
              <h4>Activity Data:</h4>
              <pre>{JSON.stringify(activityData, null, 2)}</pre>
            </div>
          ) : (
            <p>Loading activity data...</p>
          )}
        </div>
      )}
    </React.StrictMode>
  );
}
