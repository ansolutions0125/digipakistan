import { fetchSmtpConfig } from "@/lib/SmtpSettings";
import { db } from "../../../../../lib/FirebaseAdminSDK";
import { initializeTransporter } from "@/lib/TransportNodeMailer";

// getting instructionsEmail
const fetchApplicationApprovedEmailTemplate = async () => {
  try {
    const templateDoc = await db
      .collection("email_templates")
      .doc("938398LEP-2kinweae--282jpj2je2p") // Use your template document ID
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
const sendEmail = async (transporter, user, email_subject, courseData) => {
  const smtpConfig = await fetchSmtpConfig();
  const defaultTemplate = await fetchApplicationApprovedEmailTemplate();

  const mailOptions = {
    from: smtpConfig.SMTP_EMAIL_FROM,
    to: user.email,
    subject: email_subject,
    html: replacePlaceholders(defaultTemplate, {
      user: `${user.firstName} ${user.lastName}`, // Replace `${user}` with the user's name
      amount: `${courseData.totalFee}`,
      id: `${courseData.id}`,
      email: `${user.email}`,
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
    const { fetchedUserData, email_subject, courseData } = await req.json();

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

    console.log(fetchedUserData, email_subject, courseData);

    // Proceed with your logic, for example saving to Firestore
    const paymentSuccessfuly_paid = db
      .collection("failed_payments")
      .doc(fetchedUserData.uid);

    await paymentSuccessfuly_paid.set({
      userId: courseData.userId,
      paymentDate: new Date(),
      totalAmount: courseData.totalFee,
      transactionId: "txn_1234567890",
      courses: courseData.selectedCourses,
      email: courseData.email,
      fullName: courseData.fullname,
    });

    await sendEmail(transporter, fetchedUserData, email_subject, courseData);

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
