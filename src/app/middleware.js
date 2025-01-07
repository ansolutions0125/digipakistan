// middleware.js
import { firestore } from "@/Backend/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { isSignedUp, isVerified } = req.cookies;

  // Restrict access to signup and signin pages if email isn't verified
  if (isSignedUp === "true" && isVerified !== "true") {
    return NextResponse.redirect(new URL("/email-verification", req.url));
  }

  // Access the Firestore data
  const userDocRef = doc(firestore, "registration_form_data", "Dh9DCyjVnmdM7YKfV3SOuYy2D0J2");
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const { expiryDate, registrationStatus } = userDoc.data();

    // Check if registration is still pending and expiryDate is in the future
    if (registrationStatus === "pending" && new Date(expiryDate) > new Date()) {
      const url = new URL(req.url);  // Create URL from the request
      url.pathname = "/registration-pending";  // Modify pathname
      return NextResponse.redirect(url);  // Perform redirect
    }
  }

  // Allow access if conditions are met
  return NextResponse.next();
}

const config = {
  matcher: ["/registration", "/registration/*"],  // Ensure the matcher matches your intended route(s)
};

export { config };
