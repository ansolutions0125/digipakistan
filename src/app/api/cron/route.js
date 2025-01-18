import { auth, db } from "@/lib/FirebaseAdminSDK";
import { fetchSmtpConfig } from "@/lib/SmtpSettings";
import { initializeTransporter } from "@/lib/TransportNodeMailer";

//******************************************************************************************\ */ Helper functions
const replacePlaceholders = (template, placeholders) => {
  return template.replace(/\${(.*?)}/g, (_, key) => placeholders[key] || "");
};

const formatDate = (timestamp) => {
  if (!timestamp) return "Invalid date";

  try {
    //**************************************************************************** */ Convert Firestore Timestamp to Date
    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp.seconds * 1000);

    //***************************************************************************** */ Format the date in the desired format
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }); //* e.g., "29 Dec 2024"

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // e.g., "10:30 PM"

    return { formattedDate, formattedTime };
  } catch (error) {
    console.error("Error formatting date:", error);
    return { formattedDate: "Invalid date", formattedTime: "" };
  }
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
      deadlineDate: user.dueData
        ? formatDate(user.dueData).formattedDate
        : "",
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

const archiveAndDeleteUser = async (user) => {
  try {
    // Archive user data in the "archiveUsers" collection
    const archiveData = { ...user, archivedAt: new Date().toISOString() };
    await db.collection("archiveUsers").doc(user.id).set(archiveData);

    // Delete user data from Firestore collections
    await db.collection("users").doc(user.id).delete();
    await db.collection("user_information").doc(user.id).delete();

    // Delete the user from Firebase Authentication
    await auth.deleteUser(user.id);

    console.log(`User archived and deleted: ${user.email}`);
  } catch (error) {
    console.error(`Error archiving and deleting user: ${user.email}`, error);
    throw new Error(`Failed to archive and delete user: ${user.email}`);
  }
};

// Email processing logic
const processEmailSeries = async () => {
  const currentTime = new Date();

  const profileReminder = {
    "12_hours": {
      templateId: "profile_reminder_after_12_hours",
      subject: "DigiPAKISAN Awaits You: Complete Your Profile Today!",
    },
    "24_hours": {
      templateId: "profile_reminder_after_24_hours",
      subject: "Your Learning Journey Starts Soon: Complete Your Profile",
    },
    "3_days": {
      templateId: "3_days_profile_reminder",
      subject: "Time’s Running Out: Final Steps to Join DIgiPAKISTAN - National Skills Development Program!",
    },
    "7_days": {
      templateId: "profile_reminder_after_7_days",
      subject: "Don’t Miss Out: Secure Your Spot in DIgiPAKISTAN - National Skills Development Program",
    },
    "20_days": {
      templateId: "profile_reminder_20th_day_admission_closed",
      subject: "Admissions Closed: Stay Tuned for the Next DIgiPAKISTAN Batch!",
    },
    "30_days": {
      templateId: "30th_day_email_admission_reopned",
      subject: "This is Your Last Chance to Join DIgiPAKISTAN Training!",
    },
  };

  const feeReminder = {
    "12_hours": {
      templateId: "fee_reminder_after_12_hours",
      subject:
        "DigiPAKISTAN Awaits You: Pay Your Admission Fee to Confirm Your Spot!",
    },
    "24_hours": {
      templateId: "fee_reminder_after_15_days",
      subject: "Last Chance: Only 1 Day Left to Pay Your Admission Fee",
    },
    "3_days": {
      templateId: "fee_reminder_after_3_days",
      subject: "Today Deadline: Last Day to Submit Your Admission Fee",
    },
    "4_days": {
      templateId: "fee_reminder_after_4_days",
      subject: "Extended Deadline: : Admission Fee Deadline Extended by 3 Days",
    },
    "7_days": {
      templateId: "fee_reminder_after_7_days",
      subject: "Reminder: Final Chance to Pay Admission Fee",
    },
    "15_days": {
      templateId: "30th_day_email_admission_reopned",
      subject: "DigiPAKISTAN Admissions Closed – Stay Tuned for the Next Batch!",
    },
    "20_days": {
      templateId: "fee_reminder_before_20_days_admission_closed",
      subject:
        "Time's Up: Admissions Closed! Join the Next DigiPAKISTAN Batch Soon!", // next one... we are reciving email every 2 mins for testing
    },
    "30_days": {
      templateId: "30th_day_email_admission_reopned",
      subject: "Admissions Reopened: It's Time to Join DigiPAKISTAN Now!", // this one left delete user account and shift user in archive data.........
    },
  };

  const usersSnapshot = await db.collection("users").get();
  const users = usersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  let status = { emailsQueued: 0, emailsSent: 0, errors: [] };
  const results = [];
  const logMessages = [];

  await Promise.all(
    users.map(async (user) => {
      const { emailSendingTime, email_template_id } = user.profileReminder || user.feeReminder || {};
      const emailSendingTimeUTC = emailSendingTime?.toDate();
      const userSignupDate =
        user.created_at && user.created_at.toDate
          ? user.created_at.toDate() // Convert Firestore Timestamp to Date
          : new Date(user.created_at); // Fallback for plain Date or string

      const logEntry = {
        StatusName: user.profileReminder
          ? "Profile Reminder Email"
          : user.feeReminder
          ? "Fee Reminder Email"
          : "General Email Notification",
        userEmail: user.email,
        userSignupDate:
          userSignupDate?.toLocaleString("en-US", {
            timeZone: "Asia/Karachi",
          }) || "N/A",
        emailSendingTime: emailSendingTimeUTC
          ? emailSendingTimeUTC.toLocaleString("en-US", {
              timeZone: "Asia/Karachi",
            })
          : "N/A",
        currentTime: currentTime.toLocaleString("en-US", {
          timeZone: "Asia/Karachi",
        }),
        emailHeader : email_template_id,
        username:user.firstName,
      };

      logMessages.push(logEntry);

      if (
        user.isEnrollmentCompleted === true &&
        user.isEmailVerified === true &&
        user.isApproved === true &&
        user.isApplicationSubmitted === true
      ) {
        logEntry.emailStatus =
          "User in enrolled both in LMS & Website; thats why skipping email.";
        return;
      }
      if (
        user.isEnrollmentCompleted === false &&
        user.isEmailVerified === true &&
        user.isApproved === false &&
        user.isApplicationSubmitted === false
      ) {
        if (emailSendingTime && currentTime >= emailSendingTimeUTC) {
          status.emailsQueued += 1;

          const transporter = await initializeTransporter();
          const reminderMap = Object.values(profileReminder).find(
            (reminder) => reminder.templateId === email_template_id
          );

          const subject = reminderMap?.subject || "Profile Reminder";
          try {
            const emailResult = await sendEmail(
              transporter,
              user,
              subject,
              email_template_id
            );

            if (emailResult.status === "success") {
              status.emailsSent += 1;
              results.push({ email: user.email, status: "sent" });
              logEntry.emailStatus = "Email sent successfully.";
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
              logEntry.emailStatus = `Failed to send email: ${emailResult.error}`;
            }

            const nextScheduleTime = new Date(emailSendingTimeUTC);
            let nextTemplateId = email_template_id;

            //  ​‌‌‍‍‍⁡⁢⁣​‌‌‍‍⁡⁢⁣⁣// Production code for sending emails for each reminder type (12 hours, 24 hours, etc.)
            //  (only for Production environment)⁡​
            // Production-ready code should handle the case where the next template ID is not found
            // if (email_template_id === profileReminder["12_hours"].templateId) {
            //   nextScheduleTime.setDate(nextScheduleTime.getHours() + 24);
            //   nextTemplateId = profileReminder["24_hours"].templateId;
            // } else if (
            //   email_template_id === profileReminder["24_hours"].templateId
            // ) {
            //   nextScheduleTime.setDate(nextScheduleTime.getDate() + 3);
            //   nextTemplateId = profileReminder["3_days"].templateId;
            // } else if (
            //   email_template_id === profileReminder["3_days"].templateId
            // ) {
            //   nextScheduleTime.setDate(nextScheduleTime.getDate() + 7);
            //   nextTemplateId = profileReminder["7_days"].templateId;
            // } else if (
            //   email_template_id === profileReminder["7_days"].templateId
            // ) {
            //   nextScheduleTime.setDate(nextScheduleTime.getDate() + 20);
            //   nextTemplateId = profileReminder["20_days"].templateId;
            // } else if (
            //   email_template_id === profileReminder["20_days"].templateId
            // ) {
            //   nextScheduleTime.setDate(nextScheduleTime.getDate() + 30);
            //   nextTemplateId = profileReminder["30_days"].templateId;
            // } else if (
            //   email_template_id === profileReminder["30_days"].templateId
            // ) {
            //   await archiveAndDeleteUser(user);
            //   logEntry.emailStatus = `Archived and deleted user: ${user.email}`;
            //   return;
            // }

            //  ​‌‌‍‍‍⁡⁢⁣⁣// Testing code for sending emails every 2 minutes for each reminder type (12 hours, 24 hours, etc.)
            //  (only for Developement environment)⁡​
            if (email_template_id === profileReminder["12_hours"].templateId) {
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2);
              nextTemplateId = profileReminder["24_hours"].templateId;
            } else if (
              email_template_id === profileReminder["24_hours"].templateId
            ) {
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2);
              nextTemplateId = profileReminder["3_days"].templateId;
            } else if (
              email_template_id === profileReminder["3_days"].templateId
            ) {
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2);
              nextTemplateId = profileReminder["7_days"].templateId;
            } else if (
              email_template_id === profileReminder["7_days"].templateId
            ) 
            {
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2);
              nextTemplateId = profileReminder["30_days"].templateId;
            } 
            else if (
              email_template_id === profileReminder["30_days"].templateId
            ) {
              await archiveAndDeleteUser(user);
              logEntry.emailStatus = `Archived and deleted user: ${user.email}`;
              return;
            }
            await db
              .collection("users")
              .doc(user.id)
              .update({
                profileReminder: {
                  email_template_id: nextTemplateId,
                  emailSendingTime: nextScheduleTime,
                },
              });
          } catch (error) {
            status.errors.push({ email: user.email, error: error.message });
            logEntry.emailStatus = `Error: ${error.message}`;
          }
        } else {
          logEntry.emailStatus = "Email not ready to send.";
        }
      } else if (
        user.isEnrollmentCompleted === false &&
        user.isEmailVerified === true &&
        user.isApproved === true &&
        user.isApplicationSubmitted === true
      ) {
        if (emailSendingTime && currentTime >= emailSendingTimeUTC) {
          status.emailsQueued += 1;

          const transporter = await initializeTransporter();
          const reminderMap = Object.values(feeReminder).find(
            (reminder) => reminder.templateId === email_template_id
          );

          const subject = reminderMap?.subject || "Profile Reminder";
          try {
            const emailResult = await sendEmail(
              transporter,
              user,
              subject,
              email_template_id
            );

            if (emailResult.status === "success") {
              status.emailsSent += 1;
              results.push({ email: user.email, status: "sent" });
              logEntry.emailStatus = "Email sent successfully.";
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
              logEntry.emailStatus = `Failed to send email: ${emailResult.error}`;
            }

            const nextScheduleTime = new Date(emailSendingTimeUTC);
            let nextTemplateId = email_template_id;
            //  ​‌‌‍‍‍⁡⁢⁣​‌‌‍‍⁡⁢⁣⁣// Production code for sending emails for each fee reminder type (12 hours, 24 hours, etc.)
            //  (only for Production environment)​⁡
            // if (email_template_id === feeReminder["12_hours"].templateId) {
            //   nextScheduleTime.setHours(nextScheduleTime.getHours() + 24);
            //   nextTemplateId = feeReminder["24_hours"].templateId;
            // } else if (
            //   email_template_id === feeReminder["24_hours"].templateId
            // ) {
            //   nextScheduleTime.setDate(nextScheduleTime.getDate() + 3);
            //   await db
            //     .collection("users")
            //     .doc(user.id)
            //     .update({
            //       status: "First Deadline",
            //       deadlineDate: new Date(nextScheduleTime),
            //     });
            //   nextTemplateId = feeReminder["3_days"].templateId;
            // } else if (email_template_id === feeReminder["3_days"].templateId) {
            //   nextScheduleTime.setDate(nextScheduleTime.getDate() + 4);

            //   await db
            //     .collection("users")
            //     .doc(user.id)
            //     .update({
            //       status: "Deadline extended by 1 day",
            //       deadlineDate: new Date(nextScheduleTime),
            //     });
            //   nextTemplateId = feeReminder["4_days"].templateId;
            // } else if (email_template_id === feeReminder["4_days"].templateId) {
            //   nextScheduleTime.setDate(nextScheduleTime.getDate() + 7);

            //   await db
            //     .collection("users")
            //     .doc(user.id)
            //     .update({
            //       status: "Deadline extended to 3 days",
            //       deadlineDate: new Date(nextScheduleTime),
            //     });
            //   nextTemplateId = feeReminder["7_days"].templateId;
            // } else if (email_template_id === feeReminder["7_days"].templateId) {
            //   nextScheduleTime.setDate(nextScheduleTime.getDate() + 15);
            //   await db
            //     .collection("users")
            //     .doc(user.id)
            //     .update({
            //       status: "Deadline extended + 1",
            //       deadlineDate: new Date(nextScheduleTime),
            //     });
            //   nextTemplateId = feeReminder["15_days"].templateId;
            // } else if (
            //   email_template_id === feeReminder["15_days"].templateId
            // ) {
            //   nextScheduleTime.setDate(nextScheduleTime.getDate() + 20);
            //   nextTemplateId = feeReminder["20_days"].templateId;
            // } else if (
            //   email_template_id === feeReminder["20_days"].templateId
            // ) {
            //   await db.collection("users").doc(user.id).update({
            //     status: "20th_day_locked",
            //   });
            //   nextScheduleTime.setDate(nextScheduleTime.getDate() + 30);
            //   nextTemplateId = feeReminder["30_days"].templateId;
            // } else if (
            //   email_template_id === feeReminder["30_days"].templateId
            // ) {
            //   await archiveAndDeleteUser(user);
            //   logEntry.emailStatus = `Archived and deleted user after 30 days: ${user.email}`;
            //   return;
            // }

            //  ​‌‌‍‍‍⁡⁢⁣​‌‌‍‍‍⁡⁢⁣⁣// Testing code for sending emails every 2 minutes for each fee reminder type (12 hours, 24 hours, etc.)
            //  (only for Developement environment)⁡​

            if (email_template_id === feeReminder["12_hours"].templateId) {
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2); // Add 2 minutes for testing
              nextTemplateId = feeReminder["24_hours"].templateId;
            } else if (
              email_template_id === feeReminder["24_hours"].templateId
            ) {
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2);
              await db
                .collection("users")
                .doc(user.id)
                .update({
                  status: "First Deadline",
                  deadlineDate: new Date(nextScheduleTime),
                });
              nextTemplateId = feeReminder["3_days"].templateId;                                                                          
            } else if (email_template_id === feeReminder["3_days"].templateId) {
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2);
              await db
                .collection("users")
                .doc(user.id)
                .update({
                  status: "Deadline extended by 1 day",
                  deadlineDate: new Date(nextScheduleTime),
                });
              nextTemplateId = feeReminder["4_days"].templateId;
            } else if (email_template_id === feeReminder["4_days"].templateId) {
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2);
              await db
                .collection("users")
                .doc(user.id)
                .update({
                  status: "Deadline extended to 3 days",
                  deadlineDate: new Date(nextScheduleTime),
                });
              nextTemplateId = feeReminder["7_days"].templateId;
            } else if (email_template_id === feeReminder["7_days"].templateId) {
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2);
              await db
                .collection("users")
                .doc(user.id)
                .update({
                  status: "Deadline extended + 1",
                  deadlineDate: new Date(nextScheduleTime),
                });
              nextTemplateId = feeReminder["15_days"].templateId;
            } else if (
              email_template_id === feeReminder["15_days"].templateId
            ) {
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2);
              nextTemplateId = feeReminder["20_days"].templateId;
            } else if (
              email_template_id === feeReminder["20_days"].templateId
            ) {
              await db.collection("users").doc(user.id).update({
                status: "20th_day_locked",
              });
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2);
              nextTemplateId = feeReminder["30_days"].templateId;
            } else if (
              email_template_id === feeReminder["30_days"].templateId
            )  {
              nextScheduleTime.setMinutes(nextScheduleTime.getMinutes() + 2);
              await archiveAndDeleteUser(user);
              logEntry.emailStatus = `Archived and deleted user after 30 days: ${user.email}`;
              return;
            }

            console.log(nextTemplateId);
            console.log(nextScheduleTime)
            console.log(user.id)
            await db
              .collection("users")
              .doc(user.id)
              .update({
                profileReminder: {
                  email_template_id:nextTemplateId,
                  emailSendingTime:nextScheduleTime,
                },
              });
          } catch (error) {
            status.errors.push({ email: user.email, error: error.message });
            logEntry.emailStatus = `Error: ${error.message}`;
          }
        } else {
          logEntry.emailStatus = "Email not ready to send.";
        }
      }
    })
  );

  logMessages.push({ emailProcessingStatus: JSON.stringify(status) });
  return { results, status, logs: logMessages };
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
