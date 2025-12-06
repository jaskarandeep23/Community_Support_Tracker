// src/js/eventSignup.js

// Store the latest valid signup for Stage One
let currentSignup = null;

// Validate email format
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Validate all required fields
function validateRequiredFields(data) {
  const errors = {};

  if (!data.eventName || data.eventName.trim() === "") {
    errors.eventName = "Event name is required.";
  }

  if (!data.repName || data.repName.trim() === "") {
    errors.repName = "Representative name is required.";
  }

  if (!data.repEmail || data.repEmail.trim() === "") {
    errors.repEmail = "Email is required.";
  } else if (!validateEmail(data.repEmail)) {
    errors.repEmail = "Please enter a valid email.";
  }

  if (!data.role || data.role.trim() === "") {
    errors.role = "Role is required.";
  }

  return errors;
}

// Turn the form into a plain JS object
function processFormData(form) {
  return {
    eventName: form.eventName.value,
    repName: form.repName.value,
    repEmail: form.repEmail.value,
    role: form.role.value,
  };
}

function clearErrors(documentObj = document) {
  const spans = documentObj.querySelectorAll(".error");
  spans.forEach((span) => {
    span.textContent = "";
  });
}

function showErrors(errors, documentObj = document) {
  if (errors.eventName) {
    documentObj.getElementById("event-name-error").textContent =
      errors.eventName;
  }
  if (errors.repName) {
    documentObj.getElementById("rep-name-error").textContent =
      errors.repName;
  }
  if (errors.repEmail) {
    documentObj.getElementById("rep-email-error").textContent =
      errors.repEmail;
  }
  if (errors.role) {
    documentObj.getElementById("event-role-error").textContent =
      errors.role;
  }
}

function setupEventSignupForm(documentObj = document) {
  const form = documentObj.getElementById("event-signup-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const successMessage = documentObj.getElementById("form-success");
    if (successMessage) {
      successMessage.textContent = "";
    }

    clearErrors(documentObj);

    const data = processFormData(form);
    const errors = validateRequiredFields(data);

    if (Object.keys(errors).length > 0) {
      showErrors(errors, documentObj);
      return;
    }

    // Valid form – update current signup
    currentSignup = data;

    if (successMessage) {
      successMessage.textContent = "Signup saved (temporary only).";
    }

    form.reset();
  });
}

// Helper for tests so they can read the value
function getCurrentSignup() {
  return currentSignup;
}

// Auto-setup in the browser
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    setupEventSignupForm(document);
  });
}

module.exports = {
  validateEmail,
  validateRequiredFields,
  processFormData,
  clearErrors,
  showErrors,
  setupEventSignupForm,
  getCurrentSignup,
};
