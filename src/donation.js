
// Donation Tracker Logic

// Validate donation form data
function validateDonation(formData) {
  const errors = [];

  if (!formData.charity || formData.charity.trim() === "") {
    errors.push("Charity name is required.");
  }
  if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
    errors.push("Donation amount must be a positive number.");
  }
  if (!formData.date) {
    errors.push("Date is required.");
  }

  return errors;
}

// Create a donation object
function makeDonationObject(formData) {
  return {
    id: Date.now(), // unique ID
    charity: formData.charity,
    amount: Number(formData.amount),
    date: formData.date,
    comment: formData.comment || ""
  };
}

// Save data to localStorage
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Load data from localStorage
function loadFromLocalStorage(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

// Calculate total donations
function calculateTotal(donations) {
  return donations.reduce((sum, d) => sum + d.amount, 0);
}

// Render donation table and summary
function renderTableAndSummary(donations) {
  const tableBody = document.querySelector("#donationTable tbody");
  const summary = document.getElementById("donationSummary");

  if (!tableBody || !summary) return; // safeguard for tests

  // Clear old rows
  tableBody.innerHTML = "";

  // Add each donation as a row
  donations.forEach(donation => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${donation.charity}</td>
      <td>${donation.amount.toFixed(2)}</td>
      <td>${donation.date}</td>
      <td>${donation.comment}</td>
    `;
    tableBody.appendChild(row);
  });

  // Update summary
  const total = calculateTotal(donations);
  summary.textContent = `Total Donations: $${total.toFixed(2)}`;
}


// Export functions for testing

module.exports = {
  validateDonation,
  makeDonationObject,
  saveToLocalStorage,
  loadFromLocalStorage,
  calculateTotal,
  renderTableAndSummary
};
