import React, { useEffect, useState } from "react";
import axios from "axios";
export default function Today({ token }) {
  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    if (token) {
      fetchActivityData(token);
    }
  }, [token]);

  const fetchActivityData = async (token) => {
    try {
      const response = await axios.get(
        "https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json",
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
