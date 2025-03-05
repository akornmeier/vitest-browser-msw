import { describe, test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { server, API_BASE_URL } from "./setup.js";
import fetch from "node-fetch";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.close();
});

afterAll(() => {
  server.close();
});

describe("Node API Tests", () => {
  test("fetches users from mocked API", async () => {
    const response = await fetch(`${API_BASE_URL}/api/users`);
    const data = await response.json();

    expect(data).toHaveProperty("users");
    // expect(data.users).toHaveLength(3);
    // expect(data.users[0].name).toBe("John Doe");
  });
});
