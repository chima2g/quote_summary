import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url, {
      //TODO: headers would ideally be passed as a value
      "x-api-key": "f661f74e-20a7-4e9f-acfc-041cfb846505",
    })
      .then((res) => {
        if (!res.ok) {
          // error coming back from server
          throw Error("could not fetch the data for that resource");
        }
        return res.json();
      })
      .then((data) => {
        // localhost version of server returns empty array instead of 404 when string is correct but data not found
        if (Array.isArray(data) && !data.length)
          throw Error("could not fetch the data for that resource");

        setData(data);
        setError(null);
      })
      .catch((err) => {
        // auto catches network / connection error
        setError(err.message);
      });
  }, [url]);

  return { data, error };
};

export default useFetch;
