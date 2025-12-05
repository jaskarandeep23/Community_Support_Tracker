/**
 * Stage Two Tests for Volunteer Hours Tracker
 * Covers: localStorage persistence, table rendering, summary calculation, deletion
 */

import {
    saveVolunteerLog,
    deleteVolunteerLog,
    calculateTotalHours,
    renderVolunteerTable
} from "./volunteer.js";

beforeEach(() => {
    // Reset DOM every test
    document.body.innerHTML = `
        <table>
            <tbody id="volunteer-table-body"></tbody>
        </table>
        <div id="total-hours"></div>
    `;

    // Mock localStorage
    global.localStorage = {
        store: {},
        setItem(key, value) {
            this.store[key] = value;
        },
        getItem(key) {
            return this.store[key] || null;
        },
        removeItem(key) {
            delete this.store[key];
        },
        clear() {
            this.store = {};
        }
    };

    localStorage.clear();
});

/* ---------------------------------------
   UNIT TESTS
---------------------------------------- */

// Save + load a volunteer log
test("saveVolunteerLog stores an entry in localStorage", () => {
    const entry = {
        charity: "Food Bank",
        hours: 5,
        date: "2025-12-01",
        rating: 4
    };

    saveVolunteerLog(entry);

    const saved = JSON.parse(localStorage.getItem("volunteerLogs"));
    expect(saved.length).toBe(1);
    expect(saved[0].charity).toBe("Food Bank");
});

// Total hours calculation
test("calculateTotalHours returns correct sum", () => {
    const logs = [
        { hours: 2 },
        { hours: 3 },
        { hours: 5 }
    ];

    const total = calculateTotalHours(logs);
    expect(total).toBe(10);
});

// Delete a volunteer log
test("deleteVolunteerLog removes a log by index", () => {
    const logs = [
        { charity: "Food Bank", hours: 2 },
        { charity: "Shelter", hours: 5 }
    ];

    localStorage.setItem("volunteerLogs", JSON.stringify(logs));

    deleteVolunteerLog(0);

    const updated = JSON.parse(localStorage.getItem("volunteerLogs"));
    expect(updated.length).toBe(1);
    expect(updated[0].charity).toBe("Shelter");
});

/* ---------------------------------------
   INTEGRATION TESTS
---------------------------------------- */

// Table renders correctly
test("renderVolunteerTable displays logs in the table", () => {
    const logs = [
        { charity: "Food Bank", hours: 3, date: "2025-12-01", rating: 5 }
    ];

    localStorage.setItem("volunteerLogs", JSON.stringify(logs));

    renderVolunteerTable();

    const tableBody = document.querySelector("#volunteer-table-body");
    expect(tableBody.children.length).toBe(1);

    const row = tableBody.children[0];
    expect(row.children[0].textContent).toBe("Food Bank");
    expect(row.children[1].textContent).toBe("3");
});

// Summary displays correct total hours
test("summary shows correct total hours", () => {
    const logs = [
        { hours: 2 },
        { hours: 6 }
    ];

    localStorage.setItem("volunteerLogs", JSON.stringify(logs));

    renderVolunteerTable();

    const summary = document.querySelector("#total-hours").textContent;
    expect(summary.includes("8")).toBe(true); // total = 8
});

// Deleting a row updates table + summary
test("deleting a row updates table and total hours", () => {
    const logs = [
        { charity: "A", hours: 4 },
        { charity: "B", hours: 6 }
    ];

    localStorage.setItem("volunteerLogs", JSON.stringify(logs));

    renderVolunteerTable();

    // Simulate delete button
    deleteVolunteerLog(0);
    renderVolunteerTable();

    const tableBody = document.querySelector("#volunteer-table-body");
    expect(tableBody.children.length).toBe(1);

    const summary = document.querySelector("#total-hours").textContent;
    expect(summary.includes("6")).toBe(true); // Only B remains
});
