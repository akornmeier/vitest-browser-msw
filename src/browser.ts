import { setupWorker } from "msw/browser";
import { handlers } from "./shared/handlers.js";

export const worker = setupWorker(...handlers);

export function startWorker(options = {}) {
  return worker.start(options);
}

export { handlers };
