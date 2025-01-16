import { db } from "@/lib/FirebaseAdminSDK";
import { fetchSmtpConfig } from "@/lib/SmtpSettings";
import { initializeTransporter } from "@/lib/TransportNodeMailer";

// Helper functions for sending emails (you've provided these)
const replacePlaceholders = (template, placeholders) => {
  return template.replace(/\${(.*?)}/g, (_, key) => placeholders[key] || "");
};

const fetchEmailTemplateById = async (templateId) => {
  try {
    const templateDoc = await db
      .collection("email_templates")
      .doc(templateId)
      .get();
    if (templateDoc.exists) return templateDoc.data().template;
    throw new Error(`Email template with ID ${templateId} not found.`);
  } catch (error) {
    console.error("Error fetching email template:", error);
    throw error;
  }
};

const sendEmail = async (transporter, user, emailSubject, templateId) => {
  const smtpConfig = await fetchSmtpConfig();
  const template = await fetchEmailTemplateById(templateId);

  const mailOptions = {
    from: smtpConfig.SMTP_EMAIL_FROM,
    to: user.email,
    subject: emailSubject,
    html: replacePlaceholders(template, {
      user: `${user.firstName} ${user.lastName}`,
      id: user.id,
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

// Cron job logic
const processEmailSeries = async () => {
  const currentTime = new Date();
  const profileReminder = {
    "12_hours": "profile_reminder_after_12_hours",
    "24_hours": "profile_reminder_after_24_hours",
    "3_days": "profile_reminder_after_7_days",
    "7_days": "profile_reminder_after_7_days",
    "30_days": "profile_reminder_20th_day_admission_closed",
  };

  const feeReminder = {
    "12_hours": "fee_reminder_after_12_hours",
    "2_days": "fee_reminder_after_2_days",
    "3_days": "fee_reminder_after_3_days",
    "4_days": "fee_reminder_after_4_days",
    "7_days": "fee_reminder_after_7_days",
    "15_days": "fee_reminder_after_15_days",
    "20_days": "fee_reminder_before_20_days_admission_closed",
    "30_days": "fee_reminder_after_30_days",
  };

  const usersSnapshot = await db.collection("users").get();
  const users = usersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  let status = {
    emailsQueued: 0,
    emailsSent: 0,
    errors: [],
  };

  const results = [];
  const logMessages = []; // Collect logs as objects

  await Promise.all(
    users.map(async (user) => {
      const { emailSendingTime, email_template_id } = user.profileReminder;
      const emailSendingTimeUTC = emailSendingTime?.toDate();
      const userSignupDate = user.created_at?.toDate(); // Convert Firestore Timestamp to Date object....
      let logEntry = {
        StatusName: "Profile Reminder Email",
        userEmail: user.email,
        userSignupDateTime:
          userSignupDate.toLocaleString("en-US", {
            timeZone: "Asia/Karachi",
          }) || "N/A",
        emailSendingTime:
          emailSendingTimeUTC?.toLocaleString("en-US", {
            timeZone: "Asia/Karachi",
          }) || "N/A",
        currentTime: currentTime.toLocaleString("en-US", {
          timeZone: "Asia/Karachi",
        }),
      };
      logMessages.push(logEntry);

      if (
        !user.profileReminder &&
        user.isEnrollmentCompleted === false &&
        user.isEmailVerified === true &&
        user.isApproved === false &&
        user.isApplicationSubmitted === false
      ) {
        // Comparing the time between (TodayDateandTime) >= (EmailSendingTime). And if not just skips the emails sending process.....
        if (emailSendingTime && currentTime >= emailSendingTimeUTC) {
          // Stop the process if thses fields are true.....
          if (
            !user.profileReminder &&
            user.isEnrollmentCompleted === false &&
            user.isEmailVerified === true &&
            user.isApproved === false &&
            user.isApplicationSubmitted === false
          )
            return;
          status.emailsQueued += 1;
          const transporter = await initializeTransporter();

          try {
            const emailResult = await sendEmail(
              transporter,
              user,
              "Complete Your Profile",
              email_template_id
            );

            if (emailResult.status === "success") {
              status.emailsSent += 1;
              results.push({ email: user.email, status: "sent" });
              logEntry.emailStatus = "Email sent successfully";
            } else {
              status.errors.push({
                email: user.email,
                error: emailResult.error,
              });
              results.push({
                email: user.email,
                status: "failed",
                error: emailResult.error,
              });
              logEntry.emailStatus = `Failed to send email. Error: ${emailResult.error}`;
            }

            // Schedule the next email
            const nextScheduleTime = new Date(emailSendingTimeUTC);
            let nextTemplateId = email_template_id;

            if (email_template_id === profileReminder["12_hours"]) {
              nextScheduleTime.setHours(nextScheduleTime.getHours() + 24);
              nextTemplateId = profileReminder["24_hours"];
            } else if (email_template_id === profileReminder["24_hours"]) {
              nextScheduleTime.setDate(nextScheduleTime.getDate() + 3);
              nextTemplateId = profileReminder["3_days"];
            } else if (email_template_id === profileReminder["3_days"]) {
              nextScheduleTime.setDate(nextScheduleTime.getDate() + 7);
              nextTemplateId = profileReminder["7_days"];
            } else if (email_template_id === profileReminder["7_days"]) {
              nextScheduleTime.setDate(nextScheduleTime.getDate() + 30);
              nextTemplateId = profileReminder["30_days"];
            }

            await db
              .collection("users")
              .doc(user.id)
              .update({
                profileReminder: {
                  ...user.profileReminder,
                  emailSendingTime: nextScheduleTime,
                  email_template_id: nextTemplateId,
                },
              });
          } catch (error) {
            status.errors.push({ email: user.email, error: error.message });
            results.push({
              email: user.email,
              status: "error",
              error: error.message,
            });
            logEntry.emailStatus = `Error processing email. Error: ${error.message}`;
          }
        } else {
          logEntry.emailStatus = "Profile Reminder Email not ready to send"; // Render this message in the logs if the if conditions fails in any cases....
        }
      }

      if (
        user.profileReminder &&
        user.isEmailVerified === true &&
        user.isApplicationSubmitted === true &&
        user.isApproved === true
      ) {
        if (emailSendingTime && currentTime >= emailSendingTimeUTC) {
          if (
            !user.profileReminder &&
            user.isEmailVerified === false &&
            user.isApplicationSubmitted === false &&
            user.isApproved === false
          )
            return;
          status.emailsQueued += 1;
          const transporter = await initializeTransporter();

          try {
            const emailResult = await sendEmail(
              transporter,
              user,
              "Complete Your Profile",
              email_template_id
            );

            if (emailResult.status === "success") {
              status.emailsSent += 1;
              results.push({ email: user.email, status: "sent" });
              logEntry.emailStatus = "Email sent successfully";
            } else {
              status.errors.push({
                email: user.email,
                error: emailResult.error,
              });
              results.push({
                email: user.email,
                status: "failed",
                error: emailResult.error,
              });
              logEntry.emailStatus = `Failed to send email. Error: ${emailResult.error}`;
            }

            // Schedule the next email
            const nextScheduleTime = new Date(emailSendingTimeUTC);
            let nextTemplateId = email_template_id;

            if (email_template_id === feeReminder["12_hours"]) {
              nextScheduleTime.setHours(nextScheduleTime.getHours() + 24);
              nextTemplateId = feeReminder["24_hours"];
            } else if (email_template_id === feeReminder["24_hours"]) {
              nextScheduleTime.setDate(nextScheduleTime.getDate() + 3);
              nextTemplateId = feeReminder["3_days"];
            } else if (email_template_id === feeReminder["3_days"]) {
              nextScheduleTime.setDate(nextScheduleTime.getDate() + 4);
              nextTemplateId = feeReminder["4_days"];
            } else if (email_template_id === feeReminder["4_days"]) {
              nextScheduleTime.setDate(nextScheduleTime.getDate() + 7);
              nextTemplateId = feeReminder["7_days"];
            } else if (email_template_id === feeReminder["7_days"]) {
              nextScheduleTime.setDate(nextScheduleTime.getDate() + 15);
              nextTemplateId = feeReminder["15_days"];
            } else if (email_template_id === feeReminder["15_days"]) {
              nextScheduleTime.setDate(nextScheduleTime.getDate() + 20);
              nextTemplateId = feeReminder["20_days"];
            } else if (email_template_id === feeReminder["20_days"]) {
              nextScheduleTime.setDate(nextScheduleTime.getDate() + 30);
              nextTemplateId = feeReminder["30_days"];
            }

            await db
              .collection("users")
              .doc(user.id)
              .update({
                profileReminder: {
                  ...user.profileReminder,
                  emailSendingTime: nextScheduleTime,
                  email_template_id: nextTemplateId,
                },
              });
          } catch (error) {
            status.errors.push({ email: user.email, error: error.message });
            results.push({
              email: user.email,
              status: "error",
              error: error.message,
            });
            logEntry.emailStatus = `Error processing email. Error: ${error.message}`;
          }
        } else {
          logEntry.emailStatus = "Fee Reminder Email not ready to send"; // Render this message in the logs if the if conditions fails in any cases....
        }
      }
    })
  );

  logMessages.push({
    emailProcessingStatus: JSON.stringify(status), //Return the logs for admins to see the email sending logs.....
  });

  return { results, status, logs: logMessages }; //Return the whole email stauts and logs......
};

// API route handler
export async function GET(request) {
  try {
    const result = await processEmailSeries();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error processing emails.",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
