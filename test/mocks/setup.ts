import { setupServer } from "msw/node";
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Set up the worker for browser environment
export const worker = setupWorker(...handlers);

// Set up the server for Node.js environment
export const server = setupServer(...handlers);

// Function to initialize MSW based on environment
export function setupMSW() {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // For browser tests, we'll use the worker
    return worker.start();
  } else {
    // For Node.js tests, we'll use the server
    server.listen({ onUnhandledRequest: "warn" });

    return () => {
      server.close();
    };
  }
}
