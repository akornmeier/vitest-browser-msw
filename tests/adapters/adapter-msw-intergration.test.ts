import { describe, test, expect, beforeEach } from "vitest";
import { setupAccessibility } from "../../src/index";

describe("Adapter integration with MSW-served content", () => {
  beforeEach(() => {
    // Setup global accessibility object
    setupAccessibility({
      framework: "browser",
    });

    // Clear any previous page content
    document.body.innerHTML = "";
  });

  test("adapter can query elements from MSW-served content", async () => {
    // Fetch test page
    const response = await fetch("/test-pages/issues");
    const html = await response.text();
    document.body.innerHTML = html;

    // Use adapter's querySelector functionality
    const image = await window.__a11y.querySelector("img");

    // Verify we can interact with the element
    expect(image).toBeDefined();

    // Check element attributes
    const alt = await image.getAttribute("alt");
    expect(alt).toBeNull(); // Should be missing

    // Check visibility
    const isVisible = await image.isVisible();
    expect(isVisible).toBe(true);
  });

  test("adapter can run rule-specific checks", async () => {
    // Fetch specific page for testing
    const response = await fetch("/test-pages/missing-alt");
    const html = await response.text();
    document.body.innerHTML = html;

    // Use adapter to run a specific rule check
    const images = document.querySelectorAll("img");
    expect(images.length).toBe(3);

    // Verify all images are missing alt text
    for (const img of Array.from(images)) {
      expect(img.hasAttribute("alt")).toBe(false);
    }

    // Run scan and verify results
    const results = await window.runScan?.();
    expect(results.issues.length).toBe(3);
  });
});
