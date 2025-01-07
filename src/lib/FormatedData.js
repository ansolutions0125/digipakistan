export const getFormattedDate = (date) => {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date object provided.");
  }

  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Return in the desired format (e.g., "YYYY-MM-DD")
  return `${year}-${month}-${day}`;
};
