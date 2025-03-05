import { defineConfig } from "tsup";

export default defineConfig([
  // Browser build
  {
    entry: ["src/browser.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    platform: "browser",
    outDir: "dist/browser",
    esbuildOptions(options) {
      options.conditions = ["browser", "import"];
    },
  },
  // Node.js build
  {
    entry: ["src/node.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    platform: "node",
    outDir: "dist/node",
    esbuildOptions(options) {
      options.conditions = ["node", "import"];
    },
  },
]);
