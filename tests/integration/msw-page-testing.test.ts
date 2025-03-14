import { describe, test, expect, beforeEach } from "vitest";
import { setupAccessibility } from "../../src/index";

describe("Testing with MSW-served HTML content", () => {
  beforeEach(() => {
    // Setup global accessibility object
    setupAccessibility({
      framework: "browser",
    });

    // Clear any previous page content
    document.documentElement.innerHTML = "";
  });

  test("detects issues in problematic page", async () => {
    // Fetch and load the test page with issues
    const response = await fetch("/test-pages/issues");
    const html = await response.text();

    // Set the document
    document.documentElement.innerHTML = html;

    // Run the accessibility scan
    const results = await window.runScan?.();

    // Verify issues were found
    expect(results.passed).toBe(false);
    expect(results.issues.length).toBeGreaterThan(0);

    // Should find image alt text issues
    expect(results.issues.some((issue) => issue.rule === "image-alt")).toBe(
      true
    );

    // Should find form label issues
    expect(results.issues.some((issue) => issue.rule === "form-label")).toBe(
      true
    );

    // Should find contrast issues
    expect(
      results.issues.some((issue) => issue.rule === "color-contrast")
    ).toBe(true);
  });

  test("passes accessible page test", async () => {
    // Fetch and load the accessible test page
    const response = await fetch("/test-pages/accessible");
    const html = await response.text();

    // Set the document content
    document.documentElement.innerHTML = html;

    // Run the accessibility scan
    const results = await window.__a11y.scan();

    // Verify no issues were found
    expect(results.passed).toBe(true);
    expect(results.issues.length).toBe(0);
  });

  test("focuses on specific issue types", async () => {
    // Fetch and load the missing alt test page
    const response = await fetch("/test-pages/missing-alt");
    const html = await response.text();

    // Set the document content
    document.documentElement.innerHTML = html;

    // Run the accessibility scan
    const results = await window.__a11y.scan();

    // Should find only image alt issues
    expect(results.issues.every((issue) => issue.rule === "image-alt")).toBe(
      true
    );

    // Should find 3 issues (one for each image)
    expect(results.issues.length).toBe(3);
  });

  test("can dynamically configure test scenarios", async () => {
    // Fetch page with only missing alt and contrast issues
    const response = await fetch(
      "/test-pages/custom?missingAlt=true&contrast=true&missingLabels=false&headingSkip=false"
    );
    const html = await response.text();

    // Set the document content
    document.documentElement.innerHTML = html;

    // Run the accessibility scan
    const results = await window.__a11y.scan();

    // Should find specific issues
    const hasAltIssues = results.issues.some(
      (issue) => issue.rule === "image-alt"
    );
    const hasContrastIssues = results.issues.some(
      (issue) => issue.rule === "color-contrast"
    );
    const hasLabelIssues = results.issues.some(
      (issue) => issue.rule === "form-label"
    );

    expect(hasAltIssues).toBe(true);
    expect(hasContrastIssues).toBe(true);
    expect(hasLabelIssues).toBe(false);
  });

  test("can modify scan behavior with configuration", async () => {
    // Fetch problematic page
    const response = await fetch("/test-pages/issues");
    const html = await response.text();
    document.documentElement.innerHTML = html;

    // First run with all rules
    const initialResults = await window.__a11y.scan();
    expect(initialResults.issues.some((i) => i.rule === "image-alt")).toBe(
      true
    );

    // Update configuration to ignore image alt issues
    await window.__a11y.configure({
      rules: {
        "image-alt": false,
      },
    });

    // Run again with updated config
    const updatedResults = await window.__a11y.scan();

    // Should not find image alt issues anymore
    expect(updatedResults.issues.some((i) => i.rule === "image-alt")).toBe(
      false
    );

    // But should still find other issues
    expect(updatedResults.issues.length).toBeGreaterThan(0);
  });
});
