import {
  validateRequiredFields,
  validateEmail,
  processFormData,
  setupEventSignupForm,
  currentSignup,
} from "../js/eventSignup";

// Helper to build the form DOM for integration tests
function createFormHTML() {
  document.body.innerHTML = `
    <form id="event-signup-form">
      <input id="event-name" name="eventName" />
      <span class="error" id="event-name-error"></span>

      <input id="rep-name" name="repName" />
      <span class="error" id="rep-name-error"></span>

      <input id="rep-email" name="repEmail" />
      <span class="error" id="rep-email-error"></span>

      <select id="event-role" name="role">
        <option value="">Select a role</option>
        <option value="Sponsor">Sponsor</option>
      </select>
      <span class="error" id="event-role-error"></span>

      <p id="form-success"></p>
      <button type="submit">Submit</button>
    </form>
  `;
}

describe("Event Signup – validation", () => {
  test("validateRequiredFields finds empty required fields", () => {
    const data = {
      eventName: "",
      repName: "",
      repEmail: "",
      role: "",
    };

    const errors = validateRequiredFields(data);

    expect(errors.eventName).toBeDefined();
    expect(errors.repName).toBeDefined();
    expect(errors.repEmail).toBeDefined();
    expect(errors.role).toBeDefined();
  });

  test("validateRequiredFields flags invalid email", () => {
    const data = {
      eventName: "Food Drive",
      repName: "Alex",
      repEmail: "bad-email",
      role: "Sponsor",
    };

    const errors = validateRequiredFields(data);

    expect(errors.repEmail).toBe("Please enter a valid email.");
  });

  test("validateEmail accepts proper email format", () => {
    expect(validateEmail("test@example.com")).toBe(true);
  });

  test("processFormData returns correct data object", () => {
    const mockForm = {
      eventName: { value: "Cleanup Day" },
      repName: { value: "Sam" },
      repEmail: { value: "sam@example.com" },
      role: { value: "Sponsor" },
    };

    const data = processFormData(mockForm);

    expect(data).toEqual({
      eventName: "Cleanup Day",
      repName: "Sam",
      repEmail: "sam@example.com",
      role: "Sponsor",
    });
  });
});

describe("Event Signup – integration with DOM", () => {
  test("submitting valid form updates temporary data object", () => {
    createFormHTML();
    setupEventSignupForm(document);

    document.getElementById("event-name").value = "Cleanup Day";
    document.getElementById("rep-name").value = "Sam";
    document.getElementById("rep-email").value = "sam@example.com";
    document.getElementById("event-role").value = "Sponsor";

    const form = document.getElementById("event-signup-form");
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );

    expect(currentSignup).toEqual({
      eventName: "Cleanup Day",
      repName: "Sam",
      repEmail: "sam@example.com",
      role: "Sponsor",
    });
  });

  test("submitting empty form shows error messages", () => {
    createFormHTML();
    setupEventSignupForm(document);

    const form = document.getElementById("event-signup-form");
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );

    expect(
      document.getElementById("event-name-error").textContent
    ).not.toBe("");
    expect(
      document.getElementById("rep-name-error").textContent
    ).not.toBe("");
    expect(
      document.getElementById("rep-email-error").textContent
    ).not.toBe("");
    expect(
      document.getElementById("event-role-error").textContent
    ).not.toBe("");
  });
});
