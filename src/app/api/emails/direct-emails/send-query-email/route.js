import { fetchSmtpConfig } from "@/lib/SmtpSettings";
import { db } from "../../../../../lib/FirebaseAdminSDK";
import { initializeTransporter } from "@/lib/TransportNodeMailer";

// getting instructionsEmail
const fetchApplicationApprovedEmailTemplate = async () => {
  try {
    const templateDoc = await db
      .collection("email_templates")
      .doc("ej29323-232-32j3j2m3232-32") // Use your template document ID
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

const fetchSiteDetails = async () => {
  try {
    const templateDoc = await db
      .collection("site_details")
      .doc("siteDetailsId") // Use your template document ID
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
const sendEmail = async (transporter, user) => {
  const smtpConfig = await fetchSmtpConfig();
  const defaultTemplate = await fetchApplicationApprovedEmailTemplate();
  const email = await fetchSiteDetails();

  const mailOptions = {
    from: smtpConfig.SMTP_EMAIL_FROM ,
    to:'54587dfdd@gmail.com',
    subject: `${user.fullName} has Submitted Query via DigiPAKISTAN Contact Form`,
    html: replacePlaceholders(defaultTemplate, {
      fullName: `${user.fullName}`, // Replace `${user}` with the user's name
      phoneNumber: `${user.phoneNumber}`,
      emailAddress: `${user.email}`,
      subject: `${user.subject}`,
      message: `${user.message}`,
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
    const { user } = await req.json();

    // Check if fetchedUserData is valid
    if (!user || typeof user !== "object") {
      return new Response(
        JSON.stringify({
          message: "Invalid user data provided.",
        }),
        { status: 400 }
      );
    }

    const transporter = await initializeTransporter();

    await sendEmail(transporter, user);

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
