import { setupServer } from "msw/node";
import { handlers } from "../../src/shared/handlers.js";

// Define a base URL for tests
export const API_BASE_URL = "http://localhost:3000";

// Create Node.js server
export const server = setupServer(...handlers);

// Setup function for Node tests
export function setupMSW() {
  // Start the server
  server.listen({ onUnhandledRequest: "warn" });

  // Return cleanup function
  return () => {
    server.close();
  };
}
