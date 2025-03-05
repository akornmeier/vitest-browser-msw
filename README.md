# Dual Environment Setup (Browser + Node.js)

## Project Structure

```
project/
├── src/
│   ├── index.ts            # Main entry (with conditional exports)
│   ├── browser.ts          # Browser-specific entry
│   ├── node.ts             # Node-specific entry
│   └── shared/             # Shared code between environments
│       └── handlers.ts     # MSW handlers (shared)
├── test/
│   ├── browser/            # Browser-specific tests
│   │   ├── setup.ts        # Browser test setup
│   │   └── *.test.ts       # Browser tests
│   ├── node/               # Node-specific tests
│   │   ├── setup.ts        # Node test setup
│   │   └── *.test.ts       # Node tests
│   └── shared/             # Shared test utilities
├── tsup.config.ts          # tsup build configuration
├── package.json            # Package with conditional exports
├── vite.config.ts          # Base Vite configuration
└── vitest.workspace.ts     # Vitest workspace config
```

## Key Files
