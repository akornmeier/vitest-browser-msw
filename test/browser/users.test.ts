import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { worker } from "./setup.js";

beforeAll(async () => {
  await worker.start();
});

afterAll(() => {
  worker.stop();
});

describe("Browser API Tests", () => {
  test("fetches users from mocked API", async () => {
    const response = await fetch("/api/users");
    const data = await response.json();

    expect(data).toHaveProperty("users");
    expect(data.users).toHaveLength(3);
    expect(data.users[0].name).toBe("John Doe");
  });
});
