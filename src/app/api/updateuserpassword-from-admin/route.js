import { auth, db } from "@/lib/FirebaseAdminSDK";
import axios from "axios";
import { NextResponse } from "next/server";

const thinkifickeys = async () => {
  try {
    const templateDoc = await db
      .collection("thinkifickeys")
      .doc("thinkificConfig") // Use your template document ID
      .get();

    if (templateDoc.exists) {
      return templateDoc.data(); // Assuming your HTML is stored in the 'template' field
    } else {
      throw new Error("Email template not found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching email template:", error);
    throw error;
  }
};

export async function POST(req) {
  try {
    const { uid, email, password, user_id } = await req.json();
    const keys = await thinkifickeys();

    const toString = String(password)
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

    // Update the user's password in Firebase Auth
    await auth.updateUser(uid, { email, password });

    return NextResponse.json({ message: "User profile updated successfully!" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
