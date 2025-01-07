import { db } from "@/lib/FirebaseAdminSDK";
import { fetchSmtpConfig } from "@/lib/SmtpSettings";
import { initializeTransporter } from "@/lib/TransportNodeMailer";

// Replacing userName and other things like template
const replacePlaceholders = (template, placeholders) => {
  return template.replace(/\${(.*?)}/g, (_, key) => placeholders[key] || "");
};

// Fetching Email Template by ID
const fetchEmailTemplateById = async (templateId) => {
  try {
    const templateDoc = await db
      .collection("email_templates")
      .doc(templateId)
      .get();

    if (templateDoc.exists) {
      return templateDoc.data().template; // Assuming the template HTML is stored in 'template'
    } else {
      throw new Error(`Email template with ID ${templateId} not found.`);
    }
  } catch (error) {
    console.error("Error fetching email template:", error);
    throw error;
  }
};

// SendEmail Function
const sendEmail = async (transporter, user, email_subject, templateId) => {
  const smtpConfig = await fetchSmtpConfig();
  const defaultTemplate = await fetchEmailTemplateById(templateId);

  const mailOptions = {
    from: smtpConfig.SMTP_EMAIL_FROM,
    to: user.email,
    subject: email_subject,
    html: replacePlaceholders(defaultTemplate, {
      user: `${user.firstName} ${user.lastName}`,
      id: user.uid, // Replace `${user}` with the user's name
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

export async function GET(req) {
  try {
    console.log("Strating Sending Fee Reminder Emails");
    const now = new Date();
    const snapshot = await db
      .collection("registration_approved_data")
      .where("isApproved", "==", true)
      .get();

    if (snapshot.empty) {
      return new Response(
        JSON.stringify({
          message: "No Application Found.",
        }),
        { status: 200 }
      );
    }

    const batch = db.batch();

    for (const doc of snapshot.docs) {
      const approved_application = doc.data();
      const emailSchedule = approved_application.emailSchedule;
      const lastEmailSent = approved_application.lastEmailSent;

      const templateDoc = await db
        .collection("users")
        .doc(approved_application.userId) // Use your template document ID
        .get();

      const user = templateDoc.data();

      try {
        const transporter = await initializeTransporter();
        if (
          !lastEmailSent ||
          (lastEmailSent === "12hours" &&
            now >= new Date(emailSchedule["24hours"]))
        ) {
          await sendEmail(
            transporter,
            approved_application,
            "Complete Your Registration Fee for DigiPAKISTAN Today",
            "j2j938we-2k39m2ua3-2322"
          );
          batch.update(doc.ref, { lastEmailSent: "24hours" });
        } else if (
          lastEmailSent === "24hours" &&
          now >= new Date(emailSchedule["3days"])
        ) {
          await sendEmail(
            transporter,
            user,
            "Your Spot is Waiting – Pay Your Fee",
            "29823-wejwa-e2ajwe2ei222"
          );
          batch.update(doc.ref, { lastEmailSent: "3days" });
        } else if (
          lastEmailSent === "3days" &&
          now >= new Date(emailSchedule["7days"])
        ) {
          await sendEmail(
            transporter,
            user,
            "Secure Your Spot in DigiPAKISTAN",
            "2832jwne202-32nwaj823-32j382"
          );
          batch.update(doc.ref, { lastEmailSent: "7days" });
        } else if (
          lastEmailSent === "7days" &&
          now >= new Date(emailSchedule["20days"])
        ) {
          await sendEmail(
            transporter,
            user,
            "Admissions Closed: Stay Tuned for Future Opportunities",
            "32yu23723232-23u2j389233-23"
          );

          batch.update(doc.ref, {
            lastEmailSent: "20days",
            status: "locked",
            canRegister: false,
          });
        } else if (
          lastEmailSent === "20days" &&
          now >= new Date(emailSchedule["30days"])
        ) {
          const archiveRef = db.collection("archived_users").doc(doc.id);
          batch.set(archiveRef, { ...user, archivedDate: now });
          batch.delete(doc.ref);

          await sendEmail(
            transporter,
            user,
            "Exciting News: Admissions Reopened – Enroll Today",
            "j23823-23i02329832-3292032"
          );
        }
      } catch (emailError) {
        console.error(
          `Failed to process user ${doc.id} email logic:`,
          emailError
        );
      }
    }

    await batch.commit();
    return new Response(
      JSON.stringify({
        message: "Emails sent successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing email schedules:", error);
    return new Response(
      JSON.stringify({
        message: "Server Error.",
      }),
      { status: 500 }
    );
  }
}
