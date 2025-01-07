"use client";

import { useEffect, useState } from "react";

const PayproStatus = () => {
  const [payproId, setPayproId] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchToken = async () => {
    try {
      const response = await fetch("https://api.paypro.com.pk/v2/ppro/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientid: "0nJNQaxkXzUH5tV",
          clientsecret: "AcguZmGhedf8xdI",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const fetchPayproStatus = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const token = await fetchToken();

      console.log(token);

      const response = await fetch("https://api.paypro.com.pk/v2/ppro/ggos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userName: "PSDI_Initiative",
          cpayId: '20172433800049',
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch paypro status");
      }

      const result = await response.json();
      setStatus(result);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (payproId) {
      fetchPayproStatus();
    } else {
      setError("Paypro ID is required");
    }
  };

  //     const fetchToken = async () => {
  //       const response = await fetch("https://api.paypro.com.pk/v2/ppro/auth", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           clientid: "0nJNQaxkXzUH5tV",
  //           clientsecret: "AcguZmGhedf8xdI",
  //         }),
  //       });

  //       const data = await response.json();
  //       return data.access_token; // Extract the access token
  //     };

  //     const callGgosApi = async () => {
  //       const token = await fetchToken();

  //       const response = await fetch("https://api.paypro.com.pk/v2/ppro/ggos", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`, // Use the obtained token
  //         },
  //         body: JSON.stringify({
  //           userName: "PSDI_Initiative",
  //           cpayId: "20172432400159",
  //         }),
  //       });

  //       const result = await response.json();
  //       console.log(result);
  //     };

  //     callGgosApi();
  //   }, []);
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Check Paypro Status</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={payproId}
          onChange={(e) => setPayproId(e.target.value)}
          placeholder="Enter Paypro ID"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Checking..." : "Fetch Status"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {status && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Paypro Status:</h2>
          <pre className="text-sm">{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PayproStatus;


// 