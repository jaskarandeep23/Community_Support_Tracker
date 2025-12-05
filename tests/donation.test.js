const {
  validateDonation,
  makeDonationObject,
  saveToLocalStorage,
  loadFromLocalStorage,
  calculateTotal
} = require("../src/donation.js");

describe("Donation logic functions", () => {
  test("validateDonation rejects empty charity", () => {
    const formData = { charity: "", amount: 10, date: "2025-12-05", comment: "" };
    const errors = validateDonation(formData);
    expect(errors).toContain("Charity name is required.");
  });

  test("makeDonationObject creates donation with numeric amount", () => {
    const formData = { charity: "Red Cross", amount: "50", date: "2025-12-05", comment: "Help" };
    const donation = makeDonationObject(formData);
    expect(donation.amount).toBe(50);
    expect(donation.charity).toBe("Red Cross");
  });

  test("saveToLocalStorage and loadFromLocalStorage work correctly", () => {
    const donations = [{ charity: "UNICEF", amount: 20, date: "2025-12-05", comment: "" }];
    saveToLocalStorage("test_donations", donations);
    const loaded = loadFromLocalStorage("test_donations");
    expect(loaded).toEqual(donations);
  });

  test("calculateTotal sums donation amounts", () => {
    const donations = [{ amount: 10 }, { amount: 20 }, { amount: 5 }];
    expect(calculateTotal(donations)).toBe(35);
  });
});
