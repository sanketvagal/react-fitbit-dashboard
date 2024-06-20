import React, { useEffect, useState } from "react";
import { fetchActivityData } from "./api";

export default function Today({ token }) {
  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    if (token) {
      fetchActivityData(token).then((data) => setActivityData(data));
    }
  }, [token]);

  return (
    <div>
      Today {token}
      {activityData ? (
        <div>
          <h4>Activity Data:</h4>
          <pre>{JSON.stringify(activityData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading activity data...</p>
      )}
    </div>
  );
}
