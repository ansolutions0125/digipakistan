const { db } = require("./FirebaseAdminSDK");

// Helper function to fetch SMTP configuration
export const fetchSmtpConfig = async () => {
  try {
    const configDoc = await db
      .collection("config_smtp_keys")
      .doc("smtpConfig")
      .get();
    if (configDoc.exists) {
      return configDoc.data();
    } else {
      throw new Error("SMTP configuration not found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching SMTP configuration:", error);
    throw error;
  }
};
