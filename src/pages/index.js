import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import LoginPage from "./components/LoginPage";
import Today from "./components/Today";

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
          <Today token={token} />
        </div>
      )}
    </React.StrictMode>
  );
}
