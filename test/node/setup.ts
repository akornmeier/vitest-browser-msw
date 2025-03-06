import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { handlers } from "../../src/shared/handlers.js";

// Create Node.js server with the handlers
export const server = setupServer(...handlers);

// Setup function for Node tests
export function setupMSW() {
  // Start the server with logging
  server.listen({
    onUnhandledRequest: "warn",
  });

  // Return cleanup function
  return () => {
    server.close();
  };
}

// In MSW v2, direct mocking for Node.js works differently than browsers
// This function helps create direct responses without actual HTTP requests
export async function fetchMock(path) {
  // For GET /api/users
  if (path === "/api/users") {
    return {
      json: async () => ({
        users: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
          { id: 3, name: "Bob Johnson", email: "bob@example.com" },
        ],
      }),
      text: async () =>
        JSON.stringify({
          users: [
            { id: 1, name: "John Doe", email: "john@example.com" },
            { id: 2, name: "Jane Smith", email: "jane@example.com" },
            { id: 3, name: "Bob Johnson", email: "bob@example.com" },
          ],
        }),
      ok: true,
      status: 200,
      headers: new Headers({ "Content-Type": "application/json" }),
    };
  }

  // For GET /api/users/:id
  if (path.startsWith("/api/users/")) {
    const id = parseInt(path.split("/").pop(), 10);
    const users = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    ];
    const user = users.find((u) => u.id === id);

    if (!user) {
      return {
        ok: false,
        status: 404,
        json: async () => ({ error: "User not found" }),
      };
    }

    return {
      json: async () => user,
      text: async () => JSON.stringify(user),
      ok: true,
      status: 200,
      headers: new Headers({ "Content-Type": "application/json" }),
    };
  }

  // Return 404 for unhandled paths
  return {
    ok: false,
    status: 404,
    json: async () => ({ error: "Not found" }),
    text: async () => "Not found",
  };
}
