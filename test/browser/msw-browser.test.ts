import { describe, test, expect, beforeAll, afterAll, afterEach } from "vitest";
import {
  getByLabelText,
  getByRole,
  getByTestId,
  getByText,
} from "@testing-library/dom";
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
    // Fetch and render the mock HTML
    const response = await fetch("/test/basic");
    document.documentElement.innerHTML = await response.text();

    const { body } = document;

    expect(
      getByRole(body, "heading", { name: /basic test page/i })
    ).toBeDefined();
    const paragraph = getByTestId(body, "paragraph");
    expect(paragraph).toBeDefined();
    expect(paragraph.textContent).toBe("This is a test paragraph");
    expect(getByText(body, /this is a test paragraph/i)).toBeDefined();
    expect(getByRole(body, "button", { name: /click me/i })).toBeDefined();
  });

  test("loads form HTML scaffold from MSW", async () => {
    // Fetch and render the mock HTML
    const response = await fetch("/test/form");
    document.documentElement.innerHTML = await response.text();

    const { body } = document;

    // Verify that elements exist
    expect(
      getByRole(body, "heading", { name: /form test page/i, level: 1 })
    ).toBeDefined();
    expect(getByLabelText(body, /name:/i)).toBeDefined();
    expect(getByLabelText(body, /email:/i)).toBeDefined();
    expect(getByRole(body, "button", { name: /submit/i })).toBeDefined();
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
