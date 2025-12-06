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

// Export for Jest
module.exports = {
  validateVolunteer,
  makeVolunteerObject
};

/* -------------------------------------------------------
   STAGE TWO — localStorage + Table Rendering + Summary
-------------------------------------------------------- */

/** Load logs from localStorage */
function loadLogs() {
    const logs = localStorage.getItem("volunteerLogs");
    return logs ? JSON.parse(logs) : [];
}

/** Save a new volunteer log into localStorage */
export function saveVolunteerLog(entry) {
    const logs = loadLogs();
    logs.push(entry);
    localStorage.setItem("volunteerLogs", JSON.stringify(logs));
}

/** Delete a volunteer log by index */
export function deleteVolunteerLog(index) {
    const logs = loadLogs();
    logs.splice(index, 1);
    localStorage.setItem("volunteerLogs", JSON.stringify(logs));
}

/** Calculate total hours */
export function calculateTotalHours(logs) {
    return logs.reduce((sum, log) => sum + Number(log.hours), 0);
}

/** Render volunteer log table + summary */
export function renderVolunteerTable() {
    const logs = loadLogs();

    const tableBody = document.querySelector("#volunteer-table-body");
    const summaryDiv = document.querySelector("#total-hours");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    logs.forEach((log, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${log.charity}</td>
            <td>${log.hours}</td>
            <td>${log.date}</td>
            <td>${log.rating}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;

        tableBody.appendChild(row);
    });

    // Update summary
    if (summaryDiv) {
        const total = calculateTotalHours(logs);
        summaryDiv.textContent = `Total Hours Volunteered: ${total}`;
    }

    // Attach delete event listeners
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = Number(e.target.dataset.index);
            deleteVolunteerLog(idx);
            renderVolunteerTable();
        });
    });
}