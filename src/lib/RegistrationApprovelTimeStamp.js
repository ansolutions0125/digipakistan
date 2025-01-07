import { addHours } from "date-fns"; // Use date-fns or plain JS Date

export function getScheduledTimeInUTC(hoursToAdd = 4) {
  // Get the current time in PKT (UTC+5)
  const currentDate = new Date();
  const currentPKTDate = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);

  // Add the desired number of hours in PKT
  const scheduledPKTDate = addHours(currentPKTDate, hoursToAdd);

  // Convert the PKT time back to UTC
  const scheduledUTCDate = new Date(
    scheduledPKTDate.getTime() - 5 * 60 * 60 * 1000
  );

  return scheduledUTCDate.toISOString(); // Save this to your database
}

// Example usage:
const scheduledTime = getScheduledTimeInUTC();
