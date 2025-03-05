import { describe, test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { getByTestId, getByText, waitFor } from "@testing-library/dom";
import { worker } from "./setup.js";

// Setup MSW for browser tests
beforeAll(async () => {
  // Start the MSW worker
  await worker.start();
});

afterEach(() => {
  // Clean up the DOM after each test
  document.body.innerHTML = "";
});

afterAll(() => {
  // Stop the worker when tests are done
  worker.stop();
});

describe("MSW Browser Tests", () => {
  test("loads basic HTML scaffold from MSW", async () => {
    // Fetch the mock HTML page
    const response = await fetch("/test/basic");
    const html = await response.text();

    // Set the HTML content
    document.body.innerHTML = html;

    // Verify that elements exist
    const title = getByText(document.body, "Basic Test Page");
    const paragraph = getByTestId(document.body, "paragraph");
    const button = document.getElementById("test-button");

    expect(title).toBeDefined();
    expect(paragraph).toBeDefined();
    expect(paragraph.textContent).toBe("This is a test paragraph");
    expect(button).toBeDefined();
  });

  test("loads form HTML scaffold from MSW", async () => {
    // Fetch the mock HTML page
    const response = await fetch("/test/form");
    const html = await response.text();

    // Set the HTML content
    document.body.innerHTML = html;

    // Verify that elements exist
    const title = getByText(document.body, "Form Test Page");
    const nameInput = getByTestId(document.body, "name-input");
    const emailInput = getByTestId(document.body, "email-input");
    const submitButton = getByTestId(document.body, "submit-button");

    expect(title).toBeDefined();
    expect(nameInput).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(submitButton).toBeDefined();
  });

  test("fetches JSON data from MSW", async () => {
    const response = await fetch("/api/users");
    const data = await response.json();

    expect(data).toHaveProperty("users");
    expect(data.users).toHaveLength(3);
    expect(data.users[0].name).toBe("John Doe");
  });

  test("fetches specific user data from MSW", async () => {
    const response = await fetch("/api/users/2");
    const data = await response.json();

    expect(data).toHaveProperty("id", 2);
    expect(data).toHaveProperty("name", "Jane Smith");
    expect(data).toHaveProperty("email", "jane@example.com");
  });
});
