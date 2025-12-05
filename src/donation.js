// Validate donation input fields
function validateDonation({ charity, amount, date }) {
  const errors = [];
  if (!charity || charity.trim() === "") {
    errors.push("Charity is required");
  }
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    errors.push("Amount must be a positive number");
  }
  if (!date || date.trim() === "") {
    errors.push("Date is required");
  }
  return errors;
}

// Create a donation object with unique id
function makeDonationObject({ charity, amount, date, comment }) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), // unique ID
    charity,
    amount: parseFloat(amount), // store as number
    date,
    comment
  };
}

// Save data to localStorage
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Load data from localStorage
function loadFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Calculate total donated
function calculateTotal(donations) {
  return donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
}

// Render donations table and summary
function renderTableAndSummary(document) {
  const donations = loadFromLocalStorage('csr_donations');
  const tbody = document.querySelector('#donationsTable tbody');
  tbody.innerHTML = '';

  let total = 0;
  donations.forEach(donation => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${donation.charity}</td>
      <td>$${Number(donation.amount).toFixed(2)}</td>
      <td>${donation.date}</td>
      <td>${donation.comment || ''}</td>
      <td><button data-id="${donation.id}" class="delete-btn">Delete</button></td>
    `;
    tbody.appendChild(row);
    total += parseFloat(donation.amount);
  });

  document.getElementById('summary').textContent =
    `Total donated: $${total.toFixed(2)}`;
}

// Export functions for Jest tests
module.exports = {
  validateDonation,
  makeDonationObject,
  saveToLocalStorage,
  loadFromLocalStorage,
  renderTableAndSummary,
  calculateTotal
};
