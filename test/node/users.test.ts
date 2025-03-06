import { describe, test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { server, fetchMock } from "./setup.js";

beforeAll(() => {
  // Initialize MSW server before tests
  server.listen();
});

afterEach(() => {
  // Reset handlers after each test
  server.resetHandlers();
});

afterAll(() => {
  // Clean up after tests are done
  server.close();
});

describe("Node API Tests", () => {
  test("fetches users from mocked API", async () => {
    // Use our custom fetchMock instead of the native fetch
    const response = await fetchMock("/api/users");
    const data = await response.json();

    expect(data).toHaveProperty("users");
    expect(data.users).toHaveLength(3);
    expect(data.users[0].name).toBe("John Doe");
  });
});
