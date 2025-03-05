import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "node",
      include: ["test/node/**/*.test.ts"],
      environment: "node",
      setupFiles: ["test/node/setup.ts"],
    },
  },
  {
    test: {
      name: "browser",
      browser: {
        enabled: true,
        provider: "playwright",
        name: "chromium",
        instances: [
          {
            browser: "chromium",
          },
        ],
      },
      include: ["test/browser/**/*.test.ts"],
      environment: "happy-dom",
      setupFiles: ["test/browser/setup.ts"],
      deps: {
        optimizer: {
          web: {
            include: ["msw"],
          },
        },
      },
    },
  },
]);
