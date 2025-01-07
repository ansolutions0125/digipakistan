import { db } from "@/lib/FirebaseAdminSDK";
import { fetchSmtpConfig } from "@/lib/SmtpSettings";
import { initializeTransporter } from "@/lib/TransportNodeMailer";

// Fetch email template
const fetchApplicationApprovedEmailTemplate = async () => {
  try {
    const templateDoc = await db
      .collection("email_templates")
      .doc("ijj0209382-239292u320-3232")
      .get();

    if (templateDoc.exists) {
      return templateDoc.data();
    } else {
      throw new Error("Email template not found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching email template:", error);
    throw error;
  }
};

// Replace placeholders in template
const replacePlaceholders = (template, placeholders) => {
  return template.replace(/\${(.*?)}/g, (_, key) => placeholders[key] || "");
};

// Send email function
const sendEmail = async (transporter, user, email_subject) => {
  try {
    const smtpConfig = await fetchSmtpConfig();
    const defaultTemplate = await fetchApplicationApprovedEmailTemplate();

    const mailOptions = {
      from: smtpConfig.SMTP_EMAIL_FROM,
      to: user.email,
      subject: email_subject,
      html: replacePlaceholders(defaultTemplate.template, {
        user: `${user.fullname}`,
        userId: `${user.uid}`,
      }),
    };

    await transporter.sendMail(mailOptions);
    return { email: user.email, status: "success" };
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
    return { email: user.email, status: "failed", error: error.message };
  }
};

// Process pending approvals
async function processPendingApprovals() {
  const result = {
    processed: [],
    skipped: [],
    errors: [],
  };

  try {
    const now = new Date();
    console.log(`Current Time: ${now.toISOString()}`);

    // Query pending approvals
    const pendingTasksSnapshot = await db
      .collection("users")
      .where("registrationStatus", "==", "pending")
      .where("isEmailVerified", "==", true)
      .orderBy("approvalTime")
      .get();

    if (pendingTasksSnapshot.empty) {
      result.message = "No pending approvals.";
      return result;
    }

    result.message = `Fetched ${pendingTasksSnapshot.docs.length} documents for processing.`;

    for (const doc of pendingTasksSnapshot.docs) {
      const taskData = doc.data();
      const approvalTime = taskData.approvalTime
        ? new Date(taskData.approvalTime)
        : null;

      if (!approvalTime || approvalTime > now) {
        result.skipped.push({
          userId: taskData.id,
          reason: !approvalTime
            ? "Approval time missing."
            : "Approval time not yet met.",
        });
        continue;
      }

      try {
        // Update registrationStatus
        await doc.ref.update({ registrationStatus: "approved" });

        // Add to approved collection
        const approvedDocRef = db
          .collection("registration_approved_data")
          .doc(taskData.id);
        await approvedDocRef.set({
          ...taskData,
          isApproved: true,
          lastEmailSent: null,
          payment_Status: null,
        });

        // Prepare for email sending
        const transporter = await initializeTransporter();
        const fetchedUserData = {
          fullname: taskData.fullname,
          IDBCursor: taskData.id,
          email: taskData.email,
        };

        // Update user document
        const emailSendingTiming = new Date();
        emailSendingTiming.setHours(emailSendingTiming.getHours() + 12);

        const profileReminder = {
          email_template_id: "j2j938we-2k39m2ua3-2322",
          emailSendingTime: emailSendingTiming,
          status: "Fee Reminder",
        };

        const userRef = db.collection("users").doc(taskData.userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          await userRef.update({
            isApproved: true,
            profileReminder,
          });
          console.log("User document updated successfully!");
        } else {
          console.error("User document does not exist.");
        }

        // Send email
        await sendEmail(
          transporter,
          fetchedUserData,
          `Dear ${taskData.fullname}, Your registration has been approved. Welcome aboard!`
        );

        result.processed.push({
          userId: taskData.userId,
          email: taskData.email,
          message: "Successfully approved and email sent.",
        });
      } catch (innerError) {
        result.errors.push({
          userId: taskData.userId,
          error: innerError.message,
        });
      }
    }
  } catch (error) {
    result.errors.push({ message: error.message });
  }

  return result;
}

// API route handlers
export async function GET(request) {
  try {
    const result = await processPendingApprovals();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error executing cron job:", error);

    return new Response(
      JSON.stringify({
        message: "Error processing the cron job.",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST() {
  return new Response("Method Not Allowed", { status: 405 });
}
