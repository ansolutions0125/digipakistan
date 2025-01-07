import { fetchSmtpConfig } from "@/lib/SmtpSettings";
import { db } from "../../../../../lib/FirebaseAdminSDK";
import { initializeTransporter } from "@/lib/TransportNodeMailer";

// getting instructionsEmail
const fetchApplicationApprovedEmailTemplate = async () => {
  try {
    const templateDoc = await db
      .collection("email_templates")
      .doc("ijj0209382-239292u320-3232") // Use your template document ID
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
  const defaultTemplate = await fetchApplicationApprovedEmailTemplate();

  const mailOptions = {
    from: smtpConfig.SMTP_EMAIL_FROM,
    to: user.email,
    subject: email_subject,
    html: replacePlaceholders(defaultTemplate, {
      user: `${user.firstName} ${user.lastName}`, // Replace `${user}` with the user's name
      userId: `${user.uid}`,
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

    const pending_enrollmentDoc = db
      .collection("registration_form_data")
      .doc(fetchedUserData.uid);
    const pending_enrollmentSnapShot = await pending_enrollmentDoc.get();

    if (!pending_enrollmentSnapShot.exists) {
      console.log("User not found!");
      return;
    }

    setTimeout(async () => {
      const time = async () => {
        try {
          await pending_enrollmentDoc.update({
            registrationStatus: "approved",
          });

          await sendEmail(transporter, fetchedUserData, email_subject);
          console.log("User approved!");
        } catch (error) {
          console.log("User is still under review.");
        }
      };
      time();

      const approvelTimeStamp = new Date().toISOString(); // Generate current timestamp
      const approvelDate = new Date(approvelTimeStamp);

      // Calculate timestamps for email schedules
      const approvedEmailsSchedule = {
        "12hours": new Date(
          approvelDate.getTime() + 1 * 60 * 1000
        ).toISOString(),
        "24hours": new Date(
          approvelDate.getTime() + 5 * 60 * 1000
        ).toISOString(),
        "3days": new Date(
          approvelDate.getTime() + 10 * 60 * 1000
        ).toISOString(),
        "7days": new Date(
          approvelDate.getTime() + 15 * 60 * 1000
        ).toISOString(),
        "20days": new Date(
          approvelDate.getTime() + 30 * 60 * 1000
        ).toISOString(),
        "30days": new Date(
          approvelDate.getTime() + 30 * 60 * 1000
        ).toISOString(),
      };

      // store the approved apllication with schedule emails timestamps
      const approved_reigstration_data = pending_enrollmentSnapShot.data();
      const approvedDoc = db
        .collection("registration_approved_data")
        .doc(fetchedUserData.uid);

      await approvedDoc.set({
        ...approved_reigstration_data, // Include existing data
        emailSchedule: approvedEmailsSchedule,
        lastEmailSent: null,
        isApproved: true,
        payment_Status: null,
      });
    }, 10000); // 14400000 === 4 hours

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
