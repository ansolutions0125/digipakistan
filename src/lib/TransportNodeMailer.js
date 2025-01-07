import { fetchSmtpConfig } from "../lib/SmtpSettings";
import nodemailer from "nodemailer";

// Initialize transporter
export const initializeTransporter = async () => {
  const smtpConfig = await fetchSmtpConfig();
  console.log("Transport Initialized");
  return nodemailer.createTransport({
    host: smtpConfig.SMTP_HOST,
    port: parseInt(smtpConfig.SMTP_PORT, 10),
    secure: smtpConfig.SMTP_SECURE === "true",
    auth: {
      user: smtpConfig.SMTP_USER,
      pass: smtpConfig.SMTP_PASS,
    },
  });
};
