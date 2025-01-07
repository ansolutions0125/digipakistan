// app/api/payfast/payment-success/route.js
import { firestore } from "@/Backend/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import axios from "axios";
import { db } from "@/lib/FirebaseAdminSDK";

const thinkifickeys = async () => {
  try {
    const templateDoc = await db
      .collection("thinkifickeys")
      .doc("thinkificConfig") // Use your template document ID
      .get();

    if (templateDoc.exists) {
      return templateDoc.data(); // Assuming your HTML is stored in the 'template' field
    } else {
      throw new Error("Thinkific keys not found..");
    }
  } catch (error) {
    console.error("Error fetching email template:", error);
    throw error;
  }
};

const enrollUserInThinkific = async (userLmsId, coursesArray, userId) => {
  const keys = await thinkifickeys();

  const enrollmentPromises = coursesArray.map(async (course) => {
    const courseId = course.id;

    if (!courseId) {
      console.warn("Course ID is missing for a course, skipping...");
      return null;
    }

    const enrollmentData = {
      course_id: courseId,
      user_id: String(userLmsId),
      activated_at: new Date().toISOString(),
    };

    try {
      // Enroll the user
      const response = await axios.post(
        "https://api.thinkific.com/api/public/v1/enrollments",
        enrollmentData,
        {
          headers: {
            "X-Auth-API-Key": keys.thinkific_api_key,
            "X-Auth-Subdomain": keys.thinkific_subdomain,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Enrolled user ${userLmsId} in course ${courseId}`);
      return { courseId, status: "success", data: response.data };
    } catch (error) {
      console.error(
        `Error enrolling user ${userLmsId} in course ${courseId}:`,
        error.message
      );
      return { courseId, status: "failed", error: error.message };
    }
  });

  // Resolve all promises
  return await Promise.all(enrollmentPromises);
};

export async function GET(req) {
  const url = new URL(req.url);
  const user_id = url.searchParams.get("user_id");
  const email = url.searchParams.get("email");

  try {
    // Retrieve the payment document
    const paymentRef = doc(firestore, "payments", user_id);
    const paymentDoc = await getDoc(paymentRef);

    if (!paymentDoc.exists()) {
      return NextResponse.json(
        { error: "Payment document not found" },
        { status: 404 }
      );
    }

    const paymentData = paymentDoc.data();
    const userLmsId = paymentData.lmsuserid;
    const coursesArray = JSON.parse(paymentData.courses); // Assuming courses is a stringified array

    // Update payment status
    await updateDoc(paymentRef, { status: "success" });

    const enrollmentResults = await enrollUserInThinkific(
      userLmsId,
      coursesArray,
      user_id
    );

    const registrationRef = doc(firestore, "users", user_id);
    await updateDoc(registrationRef, {
      enrollingDataForm: enrollmentResults,
      registrationStatus: "completed",
    });

    const userRef = doc(firestore, "users", user_id);
    await updateDoc(userRef, {
      isEnrollmentCompleted: "true",
    });

    return NextResponse.redirect(
      new URL(`/register/registration-status`, req.url)
    );
  } catch (error) {
    console.error("Error during payment success processing:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the payment" },
      { status: 500 }
    );
  }

  // try {
  //   const paymentRef = doc(firestore, "payfast_payments", );
  //   const paymentDoc = await getDoc(paymentRef);
  //   const paymentData = paymentDoc.data();

  //   const coursesArray = JSON.parse(paymentData.courses);

  //   await updateDoc(paymentRef, {
  //     status: "success",
  //   });

  //   return NextResponse.redirect(new URL("/registration", req.url));
  // } catch (error) {
  //   return new Response(JSON.stringify({ error: error.message }), {
  //     status: 500,
  //   });
  // }
}
