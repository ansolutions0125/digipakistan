import { auth, db } from "@/lib/FirebaseAdminSDK";
import axios from "axios";
import { NextResponse } from "next/server";

const thinkifickeys = async () => {
  try {
    const templateDoc = await db
      .collection("thinkifickeys")
      .doc("thinkificConfig")
      .get();

    if (templateDoc.exists) {
      return templateDoc.data();
    } else {
      throw new Error("Thinkific keys not found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching Thinkific keys:", error);
    throw new Error("Failed to fetch Thinkific keys.");
  }
};

export async function POST(req) {
  try {
    const { password, user_id } = await req.json();
    const keys = await thinkifickeys();

    const toString = String(password);
    const response = await axios.put(
      `https://api.thinkific.com/api/public/v1/users/${user_id}`,
      { password: toString },
      {
        headers: {
          "X-Auth-API-Key": keys.thinkific_api_key,
          "X-Auth-Subdomain": keys.thinkific_subdomain,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ message: "User profile updated successfully!" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
