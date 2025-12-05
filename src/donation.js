
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

function makeDonationObject(formData) {
  return {
    id: Date.now(),
    charity: formData.charity,
    amount: Number(formData.amount),
    date: formData.date,
    comment: formData.comment || ""
  };
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function calculateTotal(donations) {
  return donations.reduce((sum, d) => sum + d.amount, 0);
}

function renderTableAndSummary(donations) {
  const tableBody = document.querySelector("#donationTable tbody");
  const summary = document.getElementById("donationSummary");
  if (!tableBody || !summary) return;

  tableBody.innerHTML = "";

  donations.forEach((donation, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${donation.charity}</td>
      <td>${donation.amount.toFixed(2)}</td>
      <td>${donation.date}</td>
      <td>${donation.comment}</td>
      <td><button class="delete-btn" data-index="${index}">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });

  summary.textContent = `Total Donations: $${calculateTotal(donations).toFixed(2)}`;

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = e.target.getAttribute("data-index");
      donations.splice(idx, 1);
      saveToLocalStorage("csr_donations", donations);
      renderTableAndSummary(donations);
    });
  });
}

module.exports = {
  validateDonation,
  makeDonationObject,
  saveToLocalStorage,
  loadFromLocalStorage,
  calculateTotal,
  renderTableAndSummary
};
