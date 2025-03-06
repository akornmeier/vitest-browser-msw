import { setupServer } from "msw/node";
import { handlers } from "./shared/handlers.js";

export const server = setupServer(...handlers);

// Start the server
export function startServer(options = {}) {
  server.listen(options);
  return () => server.close();
}

export { handlers };
