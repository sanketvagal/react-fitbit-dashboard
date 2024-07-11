import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import LoginPage from "./components/LoginPage";
import Today from "./components/Today";
import RHRMonth from "./components/RHRMonth";
import Badges from "./components/Badges";
import Month from "./components/Month";
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
            <div className="item">
              <Month token={token} />
            </div>
            <div className="item">
              <Today token={token} />
            </div>
            <div className="item">
              <RHRMonth token={token} />
            </div>
            <div className="item">
              <Badges token={token} />
            </div>
          </div>
        </div>
      )}
    </React.StrictMode>
  );
}
