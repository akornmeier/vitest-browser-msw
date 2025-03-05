import { setupWorker } from "msw/browser";
import { handlers } from "../../src/shared/handlers.js";

// Create browser worker
export const worker = setupWorker(...handlers);

// Setup function for browser tests
export async function setupMSW() {
  // Start the worker with custom options
  return worker.start({
    onUnhandledRequest: "warn",
  });
}
