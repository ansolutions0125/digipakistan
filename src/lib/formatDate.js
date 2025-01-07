// Function to format dates
export const formatDate = (dateInput) => {
    if (!dateInput) return "N/A"; // Handle null or undefined input
  
    let date;
  
    // Check if it's a Firestore Timestamp (has toDate method)
    if (dateInput.toDate) {
      date = dateInput.toDate();
    }
    // If it's already a Date object or ISO string
    else {
      date = new Date(dateInput);
    }
  
    // Format the date to "MM/DD/YYYY, h:mm:ss AM/PM"
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
  