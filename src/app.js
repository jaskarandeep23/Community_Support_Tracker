const {
  validateDonation,
  makeDonationObject,
  saveToLocalStorage,
  loadFromLocalStorage,
  renderTableAndSummary
} = require("./donation.js");

document.getElementById("donationForm").addEventListener("submit", e => {
  e.preventDefault();

  const formData = {
    charity: document.getElementById("charity").value,
    amount: document.getElementById("amount").value,
    date: document.getElementById("date").value,
    comment: document.getElementById("comment").value
  };

  const errors = validateDonation(formData);
  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  const donation = makeDonationObject(formData);
  const donations = loadFromLocalStorage("csr_donations");
  donations.push(donation);
  saveToLocalStorage("csr_donations", donations);

  renderTableAndSummary(donations);
  e.target.reset();
});

document.addEventListener("DOMContentLoaded", () => {
  const donations = loadFromLocalStorage("csr_donations");
  renderTableAndSummary(donations);
});
