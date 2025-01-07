import { fetchSmtpConfig } from "@/lib/SmtpSettings";
import { db } from "../../../../../lib/FirebaseAdminSDK";
import { initializeTransporter } from "@/lib/TransportNodeMailer";
import { NextResponse } from "next/server";

// getting instructionsEmail
const fetchApplicationApprovedEmailTemplate = async () => {
  try {
    const templateDoc = await db
      .collection("email_templates")
      .doc("72h2e-2ujehu2e2-2je87haowe992") // Use your template document ID
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

function generatePassword() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  return password;
}

// SendEmail Function
const sendEmail = async (transporter, user, email_subject, courseData) => {
  const smtpConfig = await fetchSmtpConfig();
  const defaultTemplate = await fetchApplicationApprovedEmailTemplate();

  const password = generatePassword();
  const mailOptions = {
    from: smtpConfig.SMTP_EMAIL_FROM,
    to: user.email,
    subject: email_subject,
    html: replacePlaceholders(defaultTemplate, {
      user: `${user.firstName} ${user.lastName}`, // Replace `${user}` with the user's name
      userId: `${user.uid}`,
      amount: `${courseData.totalFee}`,
      id: `${courseData.id}`,
      email: `${user.email}`,
      password: `${password}`,
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
      .collection("successful_payments")
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
