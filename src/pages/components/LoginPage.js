import { AuthContext, AuthProvider } from "react-oauth2-code-pkce";
import React, { useState, useEffect, useContext } from "react";

const authConfig = {
  clientId: process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID,
  authorizationEndpoint: "https://www.fitbit.com/oauth2/authorize",
  tokenEndpoint: "https://api.fitbit.com/oauth2/token",
  redirectUri: "http://localhost:3000/",
  scope:
    "activity cardio_fitness electrocardiogram heartrate location nutrition oxygen_saturation profile respiratory_rate settings sleep social temperature weight",
  onRefreshTokenExpire: (event) => event.logIn(undefined, undefined, "popup"),
};

const UserInfo = ({ onTokenChange }) => {
  const { token, tokenData } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      onTokenChange(token);
    }
  }, []);

  return (
    <>
      <h4>Access Token</h4>
      <pre>{token}</pre>
      <h4>User Information from JWT</h4>
      <pre>{JSON.stringify(tokenData, null, 2)}</pre>
    </>
  );
};

export default function LoginPage({ onTokenChange }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return (
    isClient && (
      <AuthProvider authConfig={authConfig}>
        <UserInfo onTokenChange={onTokenChange} />
      </AuthProvider>
    )
  );
}
