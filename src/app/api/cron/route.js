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
      id: user.uid,
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
    "12_hours": "83h23q23p2-302-32nqin329q32032",
    "24_hours": "pwle-2-32-kaej2-3k2-a92j329",
    "3_days": "932u32-30jaw2-wleow-2293ncmvmz",
    "7_days": "2093i29alea-e-232382u-32329",
    "30_days": "j23823-23i02329832-3292032",
  };

  const feeReminder = {
    "12_hours": "j2j938we-2k39m2ua3-2322",
    "24_hours": "29823-wejwa-e2ajwe2ei222",
    "3_days": "ekjwne-2k2-2k2032-323-222",
    "4_days": "j2n30-s-d2sjdj2-23k2u32j3k",
    "7_days": "2832jwne202-32nwaj823-32j382",
    "15_days": "j2372-3028jawnejjnawe-2-32",
    "20_days": "32yu23723232-23u2j389233-23",
    "30_days": "j23823-23i02329832-3292032",
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
