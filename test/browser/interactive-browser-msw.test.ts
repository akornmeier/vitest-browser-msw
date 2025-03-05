import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from "vitest";
import { getByTestId, fireEvent, waitFor } from "@testing-library/dom";
import { worker } from "./setup.js";

// Setup MSW for browser tests
beforeAll(async () => {
  // Start the MSW worker
  await worker.start();
});

afterEach(() => {
  // Clean up after each test
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

afterAll(() => {
  // Stop the worker when tests are done
  worker.stop();
});

describe("Interactive Browser Tests", () => {
  test("button click updates content", async () => {
    // Fetch the mock HTML page
    const response = await fetch("/test/basic");
    const html = await response.text();

    // Set the HTML content
    document.body.innerHTML = html;

    // Add JavaScript behavior to the button
    const button = document.getElementById("test-button");
    const paragraph = getByTestId(document.body, "paragraph");

    if (button) {
      button.addEventListener("click", () => {
        paragraph.textContent = "Button was clicked!";
      });
    }

    // Verify initial state
    expect(paragraph.textContent).toBe("This is a test paragraph");

    // Simulate clicking the button
    fireEvent.click(button as HTMLElement);

    // Verify that the paragraph text has changed
    expect(paragraph.textContent).toBe("Button was clicked!");
  });

  test("form submission works correctly", async () => {
    // Fetch the mock HTML page
    const response = await fetch("/test/form");
    const html = await response.text();

    // Set the HTML content
    document.body.innerHTML = html;

    // Mock fetch for form submission
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      )
    );

    // Add form submission handler
    const form = document.getElementById("test-form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form as HTMLFormElement);

      // In a real app, you'd send this data to a server
      fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      // Add a success message to the DOM
      const successMsg = document.createElement("div");
      successMsg.setAttribute("data-testid", "success-message");
      successMsg.textContent = "Form submitted successfully!";
      document.body.appendChild(successMsg);
    });

    // Fill out the form
    const nameInput = getByTestId(
      document.body,
      "name-input"
    ) as HTMLInputElement;
    const emailInput = getByTestId(
      document.body,
      "email-input"
    ) as HTMLInputElement;
    const submitButton = getByTestId(document.body, "submit-button");

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // Submit the form
    fireEvent.click(submitButton);

    // Check that fetch was called
    expect(fetch).toHaveBeenCalledWith("/api/submit", expect.anything());

    // Check for success message
    const successMessage = getByTestId(document.body, "success-message");
    expect(successMessage.textContent).toBe("Form submitted successfully!");
  });
});
