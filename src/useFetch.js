import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();

    fetch(url, {
      signal: abortCont.signal,
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

        // localhost version of server returns an array rather than an object. This converts it into the correct format
        if (Array.isArray(data) && data.length) {
          let amended = { location: data[0] };
          data = amended;
        }

        setIsPending(false);
        setData(data);
        setError(null);
      })
      .catch((err) => {
        // auto catches network / connection error

        if (err.name === "AbortError") {
          // console.log("fetch aborted");
        } else {
          setIsPending(false);
          setError(err.message);
        }
      });

    return () => abortCont.abort();
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;
