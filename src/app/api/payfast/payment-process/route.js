// app/api/payment/route.js

import { db } from "@/lib/FirebaseAdminSDK";

const fetchPayfastkeys = async () => {
  try {
    const templateDoc = await db
      .collection("payfastkeys")
      .doc("payfastConfig") // Use your template document ID
      .get();

    if (templateDoc.exists) {
      return templateDoc.data(); // Assuming your HTML is stored in the 'template' field
    } else {
      throw new Error("Payfast keys not found...");
    }
  } catch (error) {
    console.error("Error fetching email template:", error);
    throw error;
  }
};

export async function POST(req) {
  const { user_id, lmsuserid, course, email, phone } = await req.json();
  const amount = 1;
  const keys = await fetchPayfastkeys();

  // Simulate DB check (replace with actual DB logic)
  const checkSubmission = false; 

  if (!checkSubmission) {
    // Simulate saving to DB (replace with actual DB insert logic)
    await db
      .collection("payments")
      .doc(user_id) // Set the document ID to the user's ID
      .set({
        user_id,
        lmsuserid,
        email,
        phone,
        courses: JSON.stringify(course),
        status: "pending", // Pending until payment is verified
        amount,
        created_at: new Date(),
      });
  }

  // Merchant data
  const merchant_id = keys.merchant_id;
  const secured_key = keys.secured_key;
  const basket_id = "DigiPAKISTAN-" + Math.floor(Math.random() * 999) + 100;
  const trans_amount = 1;
  const currency_code = "PKR";
  const success_url = `https://codiskills.com/api/payfast/payment-success?user_id=${user_id}&email=${email}&${lmsuserid}`;
  const failed_url = `https://codiskills.com/api/payfast/payment-failed?user_id=${user_id}&email=${email}&${lmsuserid}`;
  const checkout_url = keys.checkout_url;

  // Generate token (simulate token generation here)
  const token = await getAccessToken(
    merchant_id,
    secured_key,
    basket_id,
    trans_amount,
    currency_code
  );

  return new Response(
    JSON.stringify({
      merchant_id,
      basket_id,
      trans_amount,
      token,
      currency_code,
      success_url,
      failed_url,
      email,
      user_id,
      lmsuserid,
      phone,
      checkout_url,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}


async function getAccessToken(
  merchant_id,
  secured_key,
  basket_id,
  trans_amount,
  currency_code
) {
  const keys = await fetchPayfastkeys();

  const tokenApiUrl = keys.tokenApiUrl;

  // Construct the POST parameters as a query string
  const urlPostParams = new URLSearchParams({
    MERCHANT_ID: merchant_id,
    SECURED_KEY: secured_key,
    BASKET_ID: basket_id,
    TXNAMT: trans_amount,
    CURRENCY_CODE: currency_code,
  });

  try {
    // Make a POST request to the API
    const response = await fetch(tokenApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Required for form-urlencoded data
        "User-Agent": "Node.js PayFast Example",
      },
      body: urlPostParams.toString(), // Send the POST parameters
    });

    // Parse the response
    const payload = await response.json();

    // Extract and return the token
    const token = payload.ACCESS_TOKEN || "";
    return token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return "";
  }
}
