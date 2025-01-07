import { fetchSmtpConfig } from "@/lib/SmtpSettings";
import { db } from "../../../../../lib/FirebaseAdminSDK";
import { initializeTransporter } from "@/lib/TransportNodeMailer";

// getting instructionsEmail
const fetchInstructionsEmail = async () => {
  try {
    const templateDoc = await db
      .collection("email_templates")
      .doc("23j892pp0-2i32jaoe203") // Use your template document ID
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

    const templateRef = db.collection("users").doc(fetchedUserData.uid); // Get the reference to the document
    const templateDoc = await templateRef.get();
    const userData = await templateDoc.data();

    if (templateDoc.exists) {
      await templateRef.update({
        ...userData,
        isApplicationSubmitted: true
      });
    }

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
