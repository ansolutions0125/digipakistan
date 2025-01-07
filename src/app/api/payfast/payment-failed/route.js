import { firestore } from "@/Backend/Firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    const email = url.searchParams.get("email");

    // Firestore reference
    const paymentRef = doc(firestore, "payments", user_id);

    // Delete document
    await deleteDoc(paymentRef);

    return NextResponse.redirect(new URL('/payment-failed', req.url));
  } catch (error) {
    console.error("Error in payment-failed route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
