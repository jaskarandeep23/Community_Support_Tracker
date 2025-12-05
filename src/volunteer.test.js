const { JSDOM } = require("jsdom");

const {
  validateVolunteer,
  makeVolunteerObject,
  calculateTotalHours,
  saveToLocalStorage,
  loadFromLocalStorage,
  renderVolunteerTable
} = require("../js/volunteer.js");

describe("Volunteer Tracker - Stage One Tests", () => {

  test("validation fails for empty fields", () => {
    const errors = validateVolunteer({
      charity: "",
      hours: "",
      date: "",
      rating: ""
    });

    expect(errors.length).toBeGreaterThan(0);
  });

  test("validation passes for valid data", () => {
    const errors = validateVolunteer({
      charity: "Red Cross",
      hours: 4,
      date: "2025-01-01",
      rating: 5
    });

    expect(errors.length).toBe(0);
  });

  test("makeVolunteerObject returns correct structure", () => {
    const obj = makeVolunteerObject({
      charity: "Food Bank",
      hours: 3,
      date: "2025-02-02",
      rating: 4
    });

    expect(obj.charity).toBe("Food Bank");
    expect(obj.hours).toBe(3);
    expect(obj.rating).toBe(4);
    expect(obj.id).toBeDefined();
  });

  test("calculateTotalHours works correctly", () => {
    const logs = [
      { hours: 2 },
      { hours: 3 },
      { hours: 5 }
    ];

    expect(calculateTotalHours(logs)).toBe(10);
  });

});
