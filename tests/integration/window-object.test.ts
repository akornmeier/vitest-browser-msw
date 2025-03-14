import { describe, test, expect, beforeEach } from "vitest";
import { setupAccessibility } from "../../src/index";

/**
 * Tests focused on the global window object integration
 */
describe("Window Object Integration", () => {
  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = "";

    // Start with a fresh configuration
    window.__a11yConfig = {
      enabled: true,
      logLevel: "error",
      rules: { all: true },
    };

    // Remove any previously added methods
    if ("__a11y" in window) {
      delete window.__a11y;
    }
  });

  test("adds global methods to window object", () => {
    setupAccessibility();

    // Check for expected methods
    expect(window.__a11y).toBeDefined();
    expect(typeof window.__a11y.scan).toBe("function");
    expect(typeof window.__a11y.configure).toBe("function");
    expect(typeof window.__a11y.getConfiguration).toBe("function");
  });

  test("preserves and uses existing window configuration", () => {
    // Set up specific configuration before initialization
    window.__a11yConfig = {
      enabled: true,
      logLevel: "warn",
      rules: {
        "image-alt": true,
        "form-label": false,
      },
    };

    setupAccessibility();

    // Verify configuration was preserved
    const config = window.__a11y.getConfiguration();
    expect(config.logLevel).toBe("warn");
    expect(config.rules["form-label"]).toBe(false);
  });

  test("can update configuration through API", async () => {
    setupAccessibility();

    // Verify initial configuration
    expect(window.__a11yConfig.enabled).toBe(true);

    // Update configuration through API
    await window.__a11y.configure({
      enabled: false,
      rules: {
        "color-contrast": false,
      },
    });

    // Verify updates were applied
    expect(window.__a11yConfig.enabled).toBe(false);
    expect(window.__a11yConfig.rules["color-contrast"]).toBe(false);
  });

  test("disabling via configuration stops scanning", async () => {
    // Setup with test content
    document.body.innerHTML = `
      <img src="test.jpg"> <!-- Missing alt text -->
    `;

    // Initialize with enabled state
    window.__a11yConfig = {
      enabled: true,
      rules: { all: true },
    };

    setupAccessibility();

    // First scan with enabled state
    const initialResults = await window.__a11y.scan();
    expect(initialResults.issues.length).toBeGreaterThan(0);

    // Disable via configuration
    await window.__a11y.configure({
      enabled: false,
    });

    // Second scan should not find any issues when disabled
    const disabledResults = await window.__a11y.scan();
    expect(disabledResults.issues.length).toBe(0);
    expect(disabledResults.passed).toBe(true);
  });

  test("maintains state between calls", async () => {
    // Setup with test content
    document.body.innerHTML = `
      <div id="test-area">
        <img src="test.jpg"> <!-- Missing alt text -->
      </div>
    `;

    setupAccessibility();

    // First scan
    await window.__a11y.scan();

    // Save a custom state
    window.__a11y.setState("lastScanTimestamp", Date.now());

    // Verify state is maintained
    expect(window.__a11y.getState("lastScanTimestamp")).toBeDefined();

    // Clear the DOM and run a new scan
    document.body.innerHTML = "";
    await window.__a11y.scan();

    // State should still be available
    expect(window.__a11y.getState("lastScanTimestamp")).toBeDefined();
  });
});
