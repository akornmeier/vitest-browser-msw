import type { AxeResults } from "axe-core";

declare global {
  interface Window {
    _isNavigating: boolean;
    _isDisposing: boolean;
    _scanInProgress: boolean;
    _lastScanResults?: AxeResults;
    _ruleOptions?: any;
    _scanContext?: any;
    _failTestOnDefect?: boolean;
    _debounceDelayMs?: number;
    runScan?: () => Promise<void>;
    disconnectObserver?: () => void;
    collectResults?: (results: AxeResults) => Promise<void>;
    beforeNavigation?: () => void;
    afterNavigation?: () => void;
  }
}

declare namespace NodeJS {
  interface Global {
    window?: {
      _isNavigating: boolean;
      _isDisposing: boolean;
      _scanInProgress: boolean;
      _lastScanResults?: AxeResults;
      _ruleOptions?: any;
      _scanContext?: any;
      _failTestOnDefect?: boolean;
      _debounceDelayMs?: number;
      runScan?: () => Promise<void>;
      disconnectObserver?: () => void;
      collectResults?: (results: AxeResults) => Promise<void>;
      beforeNavigation?: () => void;
      afterNavigation?: () => void;
    };
  }
}

// Export as module to avoid polluting the global namespace
export {};
