import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import LoginPage from "./components/LoginPage";
import Today from "./components/Today";
import RHRMonth from "./components/RHRMonth";
import Badges from "./components/Badges";
import styles from "./index.module.css";
import ActivityChart from "./components/ActivityChart";

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
          <div className="container">
            <div className={styles.item}>
              <ActivityChart token={token} />
            </div>
            <div className={styles.item}>
              <Today token={token} />
            </div>
            <div className={styles.item}>
              <RHRMonth token={token} />
            </div>
            <div className={styles.item}>
              <Badges token={token} />
            </div>
          </div>
        </div>
      )}
    </React.StrictMode>
  );
}
