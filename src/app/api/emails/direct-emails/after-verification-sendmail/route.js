import { fetchSmtpConfig } from "@/lib/SmtpSettings";
import { db } from "../../../../../lib/FirebaseAdminSDK";
import { initializeTransporter } from "@/lib/TransportNodeMailer";

// getting instructionsEmail
const fetchInstructionsEmail = async () => {
  try {
    const templateDoc = await db
      .collection("email_templates")
      .doc("2i93jaiuielao-23ko2mweio20-2j2") // Use your template document ID
      .get();

    if (templateDoc.exists) {
      return templateDoc.data().template; // Assuming your HTML is stored in the 'template' field
    } else {
      throw new Error("Email template not found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching email template:", error);
    throw error;
  }
};

const fetchThinkFicKeys = async () => {
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

// Replacing userName and other things like template
const replacePlaceholders = (template, placeholders) => {
  return template.replace(/\${(.*?)}/g, (_, key) => placeholders[key] || "");
};

// SendEmail Function
const sendEmail = async (transporter, user, email_subject) => {
  const smtpConfig = await fetchSmtpConfig();
  const defaultTemplate = await fetchInstructionsEmail();

  const mailOptions = {
    from: smtpConfig.SMTP_EMAIL_FROM,
    to: user.email,
    subject: email_subject,
    html: replacePlaceholders(defaultTemplate, {
      user: `${user.firstName} ${user.lastName}`, // Replace `${user}` with the user's name
    }),
  };

  try {
    await transporter.sendMail(mailOptions);
    return { email: user.email, status: "success" };
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
    return { email: user.email, status: "failed", error: error.message };
  }
};

// Route
// Export POST method as a named export
export async function POST(req) {
  try {
    const { fetchedUserData, email_subject } = await req.json();

    const templateRef = db.collection("users").doc(fetchedUserData.uid); // Get the reference to the document

    // Check if the document exists before attempting to update
    const templateDoc = await templateRef.get();

    function generatePassword(prefix) {
      // Generates a random number from 0 to 999,999,999
      const randomNumber = Math.floor(Math.random() * 1000000000);
      return prefix + randomNumber;
    }

    // Example usage:
    const password = generatePassword("codi");
    const keys = await fetchThinkFicKeys();

    // Store the user to digi Portal
    const userResponse = await fetch(
      "https://api.thinkific.com/api/public/v1/users",
      {
        method: "POST",
        headers: {
          "X-Auth-API-Key": keys.thinkific_api_key,
          "X-Auth-Subdomain": keys.thinkific_subdomain,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: fetchedUserData.firstName,
          last_name: fetchedUserData.lastName,
          email: fetchedUserData.email,
          password: password,
          country: "Pakistan",
        }),
      }
    );

    const userData = await userResponse.json();

    if (templateDoc.exists) {
      // Document exists, now update it
      await templateRef.update({
        isEmailVerified: true,
        portalDetails: {
          ...userData,
          lms_password: password,
        },
      });
      console.log("Document updated successfullys");
    } else {
      // Document doesn't exist
      console.log("No such document!");
      // Optionally, you can create a new document if it doesn't exist
      await templateRef.set({
        isEmailVerified: true,
      });
      console.log("Document created with email verified status");
    }

    const user_registration_red = db
      .collection("registration_form_data")
      .doc(fetchedUserData.uid);
    const user_registration_doc = await user_registration_red.get();
    if (user_registration_doc.exists) {
      // Document exists, now update it
      await user_registration_red.update({
        isEmailVerified: true,
        currentStep: 3,
        userId: fetchedUserData.uid,
        portalDetails: {
          ...userData,
          lms_password: password,
        },
      });
      console.log("Document updated successfullys");
    } else {
      // Document doesn't exist
      console.log("No such document!");
      // Optionally, you can create a new document if it doesn't exist
      await user_registration_red.set({
        isEmailVerified: true,
      });
      console.log("Document created with email verified status");
    }

    // Check if fetchedUserData is valid
    if (!fetchedUserData || typeof fetchedUserData !== "object") {
      return new Response(
        JSON.stringify({
          message: "Invalid user data provided.",
        }),
        { status: 400 }
      );
    }

    const transporter = await initializeTransporter();

    // Process each user in fetchedUserData
    await sendEmail(transporter, fetchedUserData, email_subject);

    return new Response(
      JSON.stringify({
        message: "Emails sent successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing email queue:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}