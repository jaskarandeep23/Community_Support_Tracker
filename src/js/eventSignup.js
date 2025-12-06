// ================================
// Event Signup – Stage 1 + Stage 2
// ================================

// Stage 1: store last valid signup
let currentSignup = null;

// Stage 2: store all signups
let signupList = [];
const STORAGE_KEY = "eventSignups";

// ----------------------------
// VALIDATION FUNCTIONS (Stage 1)
// ----------------------------

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

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

// Convert form inputs into a signup object
function processFormData(form) {
  return {
    id: Date.now().toString(),
    eventName: form.eventName.value,
    repName: form.repName.value,
    repEmail: form.repEmail.value,
    role: form.role.value,
  };
}

// Clear all validation error messages
function clearErrors(documentObj = document) {
  documentObj.querySelectorAll(".error").forEach((span) => {
    span.textContent = "";
  });
}

// Show validation messages
function showErrors(errors, documentObj = document) {
  if (errors.eventName) {
    documentObj.getElementById("event-name-error").textContent = errors.eventName;
  }
  if (errors.repName) {
    documentObj.getElementById("rep-name-error").textContent = errors.repName;
  }
  if (errors.repEmail) {
    documentObj.getElementById("rep-email-error").textContent = errors.repEmail;
  }
  if (errors.role) {
    documentObj.getElementById("event-role-error").textContent = errors.role;
  }
}

// ----------------------------
// LOCAL STORAGE HELPERS (Stage 2)
// ----------------------------

function loadSignupsFromStorage() {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSignupsToStorage(list) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ----------------------------
// RENDER TABLE (Stage 2)
// ----------------------------

function renderSignupTable(documentObj = document) {
  const tbody = documentObj.querySelector("#event-signup-table tbody");
  const noMsg = documentObj.getElementById("no-signups-message");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (signupList.length === 0) {
    if (noMsg) noMsg.style.display = "block";
    return;
  }

  if (noMsg) noMsg.style.display = "none";

  signupList.forEach((signup) => {
    const tr = documentObj.createElement("tr");

    tr.innerHTML = `
      <td>${signup.eventName}</td>
      <td>${signup.repName}</td>
      <td>${signup.repEmail}</td>
      <td>${signup.role}</td>
      <td><button class="delete-signup" data-id="${signup.id}">Delete</button></td>
    `;

    tbody.appendChild(tr);
  });
}

// ----------------------------
// RENDER SUMMARY (Stage 2)
// ----------------------------

function renderSummary(documentObj = document) {
  const list = documentObj.getElementById("event-summary-list");
  if (!list) return;

  const counts = signupList.reduce((acc, s) => {
    acc[s.role] = (acc[s.role] || 0) + 1;
    return acc;
  }, {});

  list.innerHTML = "";

  if (Object.keys(counts).length === 0) {
    const li = documentObj.createElement("li");
    li.textContent = "No upcoming events yet.";
    list.appendChild(li);
    return;
  }

  Object.entries(counts).forEach(([role, count]) => {
    const li = documentObj.createElement("li");
    li.textContent = `${role}: ${count} signup(s)`;
    list.appendChild(li);
  });
}

// ----------------------------
// DELETE SIGNUP (Stage 2)
// ----------------------------

function deleteSignup(id, documentObj = document) {
  signupList = signupList.filter((s) => s.id !== id);
  saveSignupsToStorage(signupList);
  renderSignupTable(documentObj);
  renderSummary(documentObj);
}

// ----------------------------
// SETUP FORM (Stage 1 + Stage 2)
// ----------------------------

function setupEventSignupForm(documentObj = document) {
  const form = documentObj.getElementById("event-signup-form");
  if (!form) return;

  signupList = loadSignupsFromStorage();
  renderSignupTable(documentObj);
  renderSummary(documentObj);

  const table = documentObj.getElementById("event-signup-table");
  if (table) {
    table.addEventListener("click", (event) => {
      if (event.target.matches("button.delete-signup")) {
        const id = event.target.getAttribute("data-id");
        deleteSignup(id, documentObj);
      }
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const successMessage = documentObj.getElementById("form-success");
    if (successMessage) successMessage.textContent = "";

    clearErrors(documentObj);

    const data = processFormData(form);
    const errors = validateRequiredFields(data);

    if (Object.keys(errors).length > 0) {
      showErrors(errors, documentObj);
      return;
    }

    currentSignup = data;

    signupList.push(data);
    saveSignupsToStorage(signupList);
    renderSignupTable(documentObj);
    renderSummary(documentObj);

    if (successMessage) successMessage.textContent = "Signup saved.";

    form.reset();
  });
}

// Stage 1 getter
function getCurrentSignup() {
  return currentSignup;
}

// Auto-run on page load
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    setupEventSignupForm(document);
  });
}

// Export for Jest tests
module.exports = {
  validateEmail,
  validateRequiredFields,
  processFormData,
  clearErrors,
  showErrors,
  setupEventSignupForm,
  getCurrentSignup,
  loadSignupsFromStorage,
  saveSignupsToStorage,
  renderSignupTable,
  renderSummary,
  deleteSignup,
};
