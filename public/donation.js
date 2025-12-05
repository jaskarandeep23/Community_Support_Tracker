// Validate donation data
function validateDonation(data) {
  let errors = [];

  // Charity Name must not be empty
  if (!data.charityName || data.charityName.trim() === "") {
    errors.push("Charity Name is required.");
  }

  // Donation Amount must be positive
  if (!data.donationAmount || data.donationAmount <= 0) {
    errors.push("Donation Amount must be greater than 0.");
  }

  // Date must be provided
  if (!data.donationDate) {
    errors.push("Donation Date is required.");
  }

  // Optional: Comment length check
  if (data.donorComment && data.donorComment.length > 200) {
    errors.push("Comment must be less than 200 characters.");
  }

  return errors;
}

// Create donation object
function makeDonationObject(data) {
  return {
    charityName: data.charityName,
    donationAmount: parseFloat(data.donationAmount),
    donationDate: data.donationDate,
    donorComment: data.donorComment || ""
  };
}

// Attach form handler
document.getElementById("donationForm").addEventListener("submit", function(event) {
  event.preventDefault();

  // Collect form data
  const formData = {
    charityName: document.getElementById("charityName").value,
    donationAmount: document.getElementById("donationAmount").value,
    donationDate: document.getElementById("donationDate").value,
    donorComment: document.getElementById("donorComment").value
  };

  // Validate
  const errors = validateDonation(formData);
  if (errors.length > 0) {
    alert("Errors:\n" + errors.join("\n"));
    return;
  }

  // Create donation object
  const donation = makeDonationObject(formData);
  console.log("Donation submitted:", donation);

  alert("Donation submitted successfully!");
});
