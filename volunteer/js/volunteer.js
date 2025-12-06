/******************************
 * STAGE ONE – VALIDATION LOGIC
 ******************************/

// Validate volunteer form inputs
function validateVolunteer({ charity, hours, date, rating }) {
  const errors = [];

  if (!charity || charity.trim() === "")
    errors.push("Charity name is required.");

  if (!hours || isNaN(hours) || Number(hours) <= 0)
    errors.push("Hours must be a positive number.");

  if (!date)
    errors.push("Date is required.");

  if (!rating || isNaN(rating) || rating < 1 || rating > 5)
    errors.push("Rating must be between 1 and 5.");

  return errors;
}

// Create volunteer data object
function makeVolunteerObject({ charity, hours, date, rating }) {
  let id;

  // Safe UUID generation for browser + Jest
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    id = crypto.randomUUID();
  } else {
    id = "id-" + Math.random().toString(36).substring(2, 11);
  }

  return {
    id,
    charity,
    hours: Number(hours),
    date,
    rating: Number(rating)
  };
}

// Calculate total volunteer hours from an array of logs
function calculateTotalHours(logs) {
  if (!Array.isArray(logs)) return 0;

  return logs.reduce((total, entry) => {
    const hours = Number(entry.hours) || 0;
    return total + hours;
  }, 0);
}


// Export for Jest
module.exports = {
  validateVolunteer,
  makeVolunteerObject,
  calculateTotalHours
};
