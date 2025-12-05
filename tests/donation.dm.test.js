/**
 * @jest-environment jsdom
 */

const { renderTableAndSummary } = require("../src/donation.js");

describe("Donation DOM rendering", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <table id="donationTable"><tbody></tbody></table>
      <p id="donationSummary"></p>
    `;
  });

  test("renderTableAndSummary adds rows to table", () => {
    const donations = [
      { charity: "Red Cross", amount: 50, date: "2025-12-05", comment: "" }
    ];
    renderTableAndSummary(donations);
    expect(document.querySelectorAll("#donationTable tbody tr").length).toBe(1);
  });

  test("renderTableAndSummary updates summary correctly", () => {
    const donations = [
      { charity: "Red Cross", amount: 50, date: "2025-12-05", comment: "" },
      { charity: "UNICEF", amount: 25, date: "2025-12-06", comment: "" }
    ];
    renderTableAndSummary(donations);
    expect(document.getElementById("donationSummary").textContent)
      .toBe("Total Donations: $75.00");
  });
});
