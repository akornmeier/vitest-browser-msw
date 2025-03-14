// tests/setup/msw-setup.ts
import { beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { setupWorker } from "msw/browser";
import { handlers } from "../mocks/handlers";

// Detect environment automatically
const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";

if (isBrowser) {
  // Browser environment setup
  const worker = setupWorker(...handlers);

  beforeAll(async () => {
    // Start the worker
    await worker.start({
      // Don't show MSW logging in console for tests
      quiet: true,
      // For service worker cleanness
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });
  });

  afterEach(() => {
    // Reset any runtime handlers
    worker.resetHandlers();
  });

  afterAll(() => {
    // Stop the worker when tests are done
    worker.stop();
  });
} else {
  // Node environment setup
  const server = setupServer(...handlers);

  beforeAll(() => {
    // Start the server
    server.listen({ onUnhandledRequest: "bypass" });
  });

  afterEach(() => {
    // Reset any runtime handlers
    server.resetHandlers();
  });

  afterAll(() => {
    // Stop the server when tests are done
    server.close();
  });
}
