/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { beforeEach, afterEach } from "vitest";

const resetWindow = () => {
  window._isNavigating = false;
  window._isDisposing = false;
  window._scanInProgress = false;
  window._lastScanResults = undefined;
  window._ruleOptions = undefined;
  window._scanContext = undefined;
  window._failTestOnDefect = false;
  window._debounceDelayMs = 250; // Default debounce delay
  window.runScan = undefined;
  window.disconnectObserver = undefined;
  window.collectResults = undefined;
  window.beforeNavigation = undefined;
  window.afterNavigation = undefined;
};

beforeEach(() => {
  // Reset DOM before each test
  document.body.innerHTML = "";
  // Reset window state
  resetWindow();
});

afterEach(() => {
  // Clean up test artifacts
  document.body.innerHTML = "";
});
