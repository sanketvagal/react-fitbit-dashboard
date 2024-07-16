import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import styles from "./index.module.css";

import LoginPage from "./components/LoginPage";
import Today from "./components/Today";
import RHRMonth from "./components/RHRMonth";
import Badges from "./components/Badges";
import ActivityChart from "./components/ActivityChart";
import SleepChart from "./components/SleepChart";
import Weight from "./components/Weight";

export default function Home() {
  const [token, setToken] = useState(null);

  const handleTokenChange = (newToken) => {
    setToken(newToken);
  };

  return (
    <React.StrictMode>
      {!token ? (
        <LoginPage onTokenChange={handleTokenChange} />
      ) : (
        <div>
          <h2>Dashboard</h2>
          {console.log("token", token)}
          <div className={styles.container}>
            <div className={styles.today}>
              <Today token={token} />
            </div>
            <div className={styles.chart}>
              <ActivityChart token={token} />
            </div>
            <div className={styles.badges}>
              <Badges token={token} />
            </div>
            <div className={styles.chart}>
              <Weight token={token} />
            </div>
            <div className={styles.chart}>
              <RHRMonth token={token} />
            </div>
            <div className={styles.chart}>
              <SleepChart token={token} />
            </div>
          </div>
        </div>
      )}
    </React.StrictMode>
  );
}
