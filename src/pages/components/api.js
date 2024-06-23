import axios from "axios";

export const fetchData = async (token, endpoints) => {
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
  //   console.log("responses", responses);
  return responses.map((response) => {
    if (response.error) {
      console.error("Error fetching activity data:", response.error);
      return null;
    } else {
      return response.data;
    }
  });
};
