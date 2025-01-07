import { auth, db } from "@/lib/FirebaseAdminSDK";
import { fetchSmtpConfig } from "@/lib/SmtpSettings";
import { initializeTransporter } from "@/lib/TransportNodeMailer";

// Helper Function To Get Default Email Template
const fetchDefaultEmailTemplate = async () => {
  try {
    const templateDoc = await db
      .collection("email_templates")
      .doc("m8whNEiwen22ijaum8m2uehuin") // Use your template document ID
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

const replacePlaceholders = (template, placeholders) => {
  return template.replace(/\${(.*?)}/g, (_, key) => placeholders[key] || "");
};

// Helper function to send email
const sendEmail = async (transporter, user, email_subject, email_template) => {
  const smtpConfig = await fetchSmtpConfig();
  const defaultTemplate = await fetchDefaultEmailTemplate();

  const mailOptions = {
    from: smtpConfig.SMTP_EMAIL_FROM,
    to: user.email,
    subject: email_subject,
    html: replacePlaceholders(defaultTemplate, {
      user: user.firstName, // Replace `${user}` with the user's name
      email_template: email_template, // Replace `${email_template}` with the email content
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

// Export POST method as a named export
export async function POST(req) {
  try {
    const { fetchedUserData, userIds, email_subject, email_template } =
      await req.json();

    const transporter = await initializeTransporter();
    const emailResults = [];

    // Case 1: Direct Users
    if (fetchedUserData && fetchedUserData.length > 0) {
      const batchResults = await Promise.all(
        fetchedUserData.map((user) =>
          sendEmail(transporter, user, email_subject, email_template)
        )
      );
      return new Response(
        JSON.stringify({
          message: "Emails sent directly to specified users.",
          emailResults: batchResults,
        }),
        { status: 200 }
      );
    }

    // Case 2: Fetch Users Which Are Enrolled in a Course.
    if (userIds && userIds.length > 0) {
      const fetchUsersByUids = async (userIds) => {
        const userSnapshots = [];
        for (const uid of userIds) {
          const snapshot = await db
            .collection("users")
            .where("uid", "==", uid)
            .get();
          if (!snapshot.empty) {
            userSnapshots.push(...snapshot.docs);
          }
        }
        return userSnapshots.map((doc) => doc.data());
      };

      const enrolledUsers = await fetchUsersByUids(userIds);
      if (!enrolledUsers || enrolledUsers.length === 0) {
        return new Response(
          JSON.stringify({
            message: "No users found for the provided IDs.",
          }),
          { status: 404 }
        );
      }

      const batchResults = await Promise.all(
        enrolledUsers.map((user) =>
          sendEmail(transporter, user, email_subject, email_template)
        )
      );

      return new Response(
        JSON.stringify({
          message: "Emails sent to users enrolled in the course.",
          emailResults: batchResults,
        }),
        { status: 200 }
      );
    }

    // Case 3: Queue System for All Users
    const collectionSnapshot = await db
      .collection("emails_queue_data")
      .limit(1)
      .get();
    if (collectionSnapshot.empty) {
      return new Response(
        JSON.stringify({
          message: "No users found in the queue.",
        }),
        { status: 400 }
      );
    }

    const firstDoc = collectionSnapshot.docs[0];
    const users = firstDoc.data().data;

    const batchSize = 2;
    const delayBetweenBatches = 300000; //! 5 mins

    const processEmailQueue = async (currentIndex = 0) => {
      if (currentIndex >= users.length) return;
      const batch = users.slice(currentIndex, currentIndex + batchSize);
      const batchResults = await Promise.all(
        batch.map((user) =>
          sendEmail(transporter, user, email_subject, email_template)
        )
      );
      emailResults.push(...batchResults);
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
      return processEmailQueue(currentIndex + batchSize);
    };

    await processEmailQueue();
    await db.collection("emails_queue_data").doc(firstDoc.id).delete();

    return new Response(
      JSON.stringify({
        message: "Email queue process completed.",
        emailResults,
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
