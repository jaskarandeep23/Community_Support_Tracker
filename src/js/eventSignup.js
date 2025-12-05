// Temporary storage for the latest signup (Stage One requirement)
export let currentSignup = null;

// Validate email format
export function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Check required fields and email
export function validateRequiredFields(data) {
  const errors = {};

  if (!data.eventName.trim()) errors.eventName = "Event name is required.";
  if (!data.repName.trim())
    errors.repName = "Representative name is required.";

  if (!data.repEmail.trim()) {
    errors.repEmail = "Email is required.";
  } else if (!validateEmail(data.repEmail)) {
    errors.repEmail = "Please enter a valid email.";
  }

  if (!data.role.trim()) errors.role = "Role is required.";

  return errors; // if empty, form is valid
}

// Turn the form into a plain JS object
export function processFormData(form) {
  return {
    eventName: form.eventName.value,
    repName: form.repName.value,
    repEmail: form.repEmail.value,
    role: form.role.value,
  };
}

export function clearErrors(documentObj = document) {
  documentObj.querySelectorAll(".error").forEach((span) => {
    span.textContent = "";
  });
}

export function showErrors(errors, documentObj = document) {
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

// Hook up the submit handler
export function setupEventSignupForm(documentObj = document) {
  const form = documentObj.getElementById("event-signup-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const successMessage = documentObj.getElementById("form-success");
    if (successMessage) successMessage.textContent = "";

    clearErrors(documentObj);

    const data = processFormData(form);
    const errors = validateRequiredFields(data);

    if (Object.keys(errors).length > 0) {
      showErrors(errors, documentObj);
      return; // stop, do not save
    }

    // ✅ valid: update temporary data object
    currentSignup = data;

    if (successMessage) {
      successMessage.textContent = "Signup saved (temporary only).";
    }

    form.reset();
  });
}

// Run automatically in the browser (but not in Jest environment)
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    setupEventSignupForm(document);
  });
}
