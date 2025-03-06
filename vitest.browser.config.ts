import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "browser",
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
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
});
