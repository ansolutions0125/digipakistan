import { db } from "@/lib/FirebaseAdminSDK";
import axios from "axios";

async function getAuthToken(clientId, clientSecret) {
  const url = "https://api.paypro.com.pk/v2/ppro/auth";
  const data = {
    clientid: clientId,
    clientsecret: clientSecret,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data === "Authorized") {
      const token = response.headers["token"];
      return token;
    }
    throw new Error("Authorization failed.");
  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null;
  }
}

async function getCurlHandle(payData, token) {
  const url = "https://api.paypro.com.pk/v2/ppro/co";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(payData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getCurlHandle:", error);
    throw error; // Rethrow the error to handle it higher up if needed
  }
}

const fetchPayProkeys = async () => {
  try {
    const templateDoc = await db
      .collection("payprokeys")
      .doc("payproConfig") // Use your template document ID
      .get();

    if (templateDoc.exists) {
      return templateDoc.data(); // Assuming your HTML is stored in the 'template' field
    } else {
      throw new Error("PayPro keys not found..");
    }
  } catch (error) {
    console.error("Error fetching email template:", error);
    throw error;
  }
};

export async function POST(req) {
  try {
    const { userId, fullName, amount, phone, email, address } =
      await req.json();

    const keys = await fetchPayProkeys();
    const payproSettings = {
      clientId: keys.client_id,
      clientSecret: keys.client_secret,
      MerchantId: keys.merchant_id,
    };

    const token = await getAuthToken(
      payproSettings.clientId,
      payproSettings.clientSecret
    );

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Failed to get authentication token." }),
        { status: 500 }
      );
    }

    const randomNumber = Math.floor(Math.random() * 500) + 1;
    const invoiceNumber = `inv${randomNumber}-${userId}`;
    const issueDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 2);
    const formattedDueDate = dueDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    const payData = [
      {
        MerchantId: payproSettings.MerchantId, // Replace with your actual Merchant ID
      },
      {
        OrderNumber: invoiceNumber, // Replace with your actual invoice number (e.g., 'inv123')
        OrderAmount: '100', // The order amount
        OrderDueDate: formattedDueDate, // The formatted due date (e.g., '2024-12-31')
        OrderType: "Service", // Order type (e.g., 'Service')
        IssueDate: issueDate, // The issue date (e.g., '2024-12-01')
        OrderExpireAfterSeconds: 0, // Expiry time in seconds (set to 0)
        CustomerName: fullName, // Customer's full name
        CustomerMobile: "", // Customer's phone number, ensure "0" is removed if it starts with one
        CustomerEmail: email, // Customer's email
        CustomerAddress: address, // Customer's address
      },
    ];

    const result = await getCurlHandle(payData, token);
    console.log(result);

    if (!result || !result[1]?.PayProId) {
      return new Response(
        JSON.stringify({ error: "Failed to generate consumer ID." }),
        { status: 500 }
      );
    }

    const payProId = result[1].PayProId;
    const status = result[0].Status;
    console.log(payProId);

    return new Response(JSON.stringify({ payProId, status }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }
}
