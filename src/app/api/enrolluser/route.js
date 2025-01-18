import { firestore } from "@/Backend/Firebase";
import { addDoc, doc, getDoc } from "firebase/firestore"; // Removed updateDoc since it's not used
import { db } from "@/lib/FirebaseAdminSDK"; // Assuming this is Firestore Admin SDK
import { connectStorageEmulator } from "firebase/storage";

// Fetch Thinkific keys from Firestore
const thinkificKeys = async () => {
  try {
    const templateDoc = await db.collection("thinkifickeys").doc("thinkificConfig").get();

    if (templateDoc.exists) {
      return templateDoc.data();
    } else {
      throw new Error("Thinkific keys not found.");
    }
  } catch (error) {
    console.error("Error fetching Thinkific keys:", error);
    throw error;
  }
};

const enrollUser = async ({ userLMSId, coursesArray, userId }) => {
    try {
      const keys = await thinkificKeys();
  
      const enrolledPromises = coursesArray.map(async (course) => {
        const courseId = course.lmsCourseId;
  
        if (!courseId) {
          console.warn("LMS Course ID is missing, skipping this course.");
          return null; 
        }
  
        const enrollmentData = {
          course_id: courseId,
          user_id: userLMSId,
          activated_at: new Date().toISOString(),
        };
  
        try {
          const response = await fetch(
            "https://api.thinkific.com/api/public/v1/enrollments",
            {
              method: "POST", 
              headers: {
                "X-Auth-API-Key": keys.thinkific_api_key,
                "X-Auth-Subdomain": keys.thinkific_subdomain,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(enrollmentData), 
            }
          );
  
          const result = await response.json();
  
        
          if (!response.ok) {
            console.error(`Failed to enroll user in course ${courseId}:`, result);
            throw new Error(result.message || `Failed to enroll in course ${courseId}`);
          }
  
          console.log(`Enrollment successful for course ${courseId}:`, result);
          return result;
        } catch (error) {
          console.error(`Error during enrollment for course ${courseId}:`, error);
          throw error;
        }
      });
  
      // Wait for all enrollments to complete
      const results = await Promise.allSettled(enrolledPromises);
  
      // Log results for debugging
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          console.log(`Enrollment succeeded for course ${coursesArray[index]?.lmsCourseId}`, result.value);
        } else {
          console.error(`Enrollment failed for course ${coursesArray[index]?.lmsCourseId}`, result.reason);
        }
      });
  
      // Return only successful enrollments
      return results.filter((result) => result.status === "fulfilled").map((result) => result.value);
    } catch (error) {
      console.error("Error enrolling user:", error);
      throw error;
    }
  };
  

// POST Handler for Enrolling Users
export async function POST(req) {
  try {
    const { userLMSId, coursesArray, userId } = await req.json();

    // Validate input
    if (!userLMSId || !Array.isArray(coursesArray) || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters." }),
        { status: 400 }
      );
    }

    // Enroll user in courses
    const enrollments = await enrollUser({ userLMSId, coursesArray, userId });
    console.log(enrollments);

    const userRef = db.collection("users").doc(userId);
    const userSnapshot = await userRef.get();
    const userDataa = userSnapshot.data();
    await db.collection("users").doc(userId).update({
      isUserCoursesEnrolled: true,
    });

    // Add data to `enrolled_student_data` collection

    const enrollmentData = {
        userDataa,
        userLMSId,
        enrollments: coursesArray.map((course) => ({
          courseId: course.lmsCourseId,
          enrolledAt: new Date().toISOString(),
        })),
      };
  
      // Add or update the document in `enrolled_student_data`
      const enrolledDataRef = db.collection("enrolled_student_data").doc(userId);
      await enrolledDataRef.set(enrollmentData, { merge: true }); // Use merge to update or create
  
      return new Response(
        JSON.stringify({
          message: "Enrollments created successfully.",
          enrollmentData,
        }),
        { status: 200 }
      );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
