import axios from "axios";

const BASE_URL = "https://api.fitbit.com/1/user/-/activities";

const endpoints = {
  todaySteps: `${BASE_URL}/steps/date/today/1d.json`,
  todayCalories: `${BASE_URL}/calories/date/today/1d.json`,
  todayDistance: `${BASE_URL}/distance/date/today/1d.json`,
  todayFloors: `${BASE_URL}/floors/date/today/1d.json`,
  todayElevation: `${BASE_URL}/elevation/date/today/1d.json`,
  todayMinutesSedentary: `${BASE_URL}/minutesSedentary/date/today/1d.json`,
  todayMinutesVeryActive: `${BASE_URL}/minutesVeryActive/date/today/1d.json`,
};

export const fetchActivityData = async (token) => {
  const urls = Object.values(endpoints);
  const requests = urls.map((url) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => ({ error }))
  );
  const responses = await Promise.all(requests);
  return responses.map((response) => {
    if (response.error) {
      console.error("Error fetching activity data:", response.error);
      return null;
    } else {
      return response.data;
    }
  });
};
