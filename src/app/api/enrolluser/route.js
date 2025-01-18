import { firestore } from "@/Backend/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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

const enrollUser = async ({ userLMSId, coursesArray, userId }) => {
  const keys = await thinkifickeys();
  const enrolledPromises = coursesArray.map(async (course) => {
    const courseId = course.lmsCourseId;

    if (!course) {
      console.warn(
        "lms Course Id Is missing,please enter the course id in you fied"
      );
    }

    const enrolledData = {
      course_id: courseId,
      user_id: userId,
      activated_at: new Date().toISOString(),
    };

    try {
      const data = await fetch(
        "https://api.thinkific.com/api/public/v1/enrollments",
        {
          headers: {
            "X-Auth-API-Key": keys.thinkific_api_key,
            "X-Auth-Subdomain": keys.thinkific_subdomain,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enrolledData),
        }
      );

      const res = await data.json();
      console.log(res);
      console.log("new Enrollment Registered on digiskill's thinkific portal");
    } catch (error) {
      console.log("error while creating new user's enrollement",error);

    }
  });
};


export async function POST(){
    try {
        const {userLMSId,coursesArray,userId}  = await req.json();
        
       const data =  await enrollUser(userLMSId,coursesArray,userId);
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}
