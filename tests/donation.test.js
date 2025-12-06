const {
  validateDonation,
  makeDonationObject,
  saveToLocalStorage,
  loadFromLocalStorage,
  calculateTotal
} = require("../src/donation.js");

describe("Donation logic functions", () => {
  test("validateDonation rejects empty charity", () => {
    const errors = validateDonation({ charity: "", amount: 10, date: "2025-12-05" });
    expect(errors).toContain("Charity name is required.");
  });

  test("makeDonationObject creates donation with numeric amount", () => {
    const donation = makeDonationObject({ charity: "Red Cross", amount: "50", date: "2025-12-05" });
    expect(donation.amount).toBe(50);
  });

  test("save/load localStorage works", () => {
    const donations = [{ charity: "UNICEF", amount: 20, date: "2025-12-05" }];
    saveToLocalStorage("test_donations", donations);
    expect(loadFromLocalStorage("test_donations")).toEqual(donations);
  });

  test("calculateTotal sums donations", () => {
    expect(calculateTotal([{ amount: 10 }, { amount: 20 }])).toBe(30);
  });
});
