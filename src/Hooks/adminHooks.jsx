// hooks/useAdmin.js
"use client"; // Ensure client-side rendering only

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const useAdmin = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchAdmin = async () => {
      const adminDataFromCookies = Cookies.get("admin_data");
      if (adminDataFromCookies) {
        const bytes = CryptoJS.AES.decrypt(
          adminDataFromCookies,
          process.env.NEXT_PUBLIC_ADMIN_ENCRYPTION_KEY // Environment variable in Next.js
        );
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        setAdminData(decryptedData);
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchAdmin();
  }, []);

  return { adminData, loading }; // Return loading state
};

export default useAdmin;
