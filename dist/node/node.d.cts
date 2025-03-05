import * as msw_node from 'msw/node';
import * as msw from 'msw';

declare const handlers: msw.HttpHandler[];

declare const server: msw_node.SetupServerApi;
declare function startServer(options?: {}): () => void;

export { handlers, server, startServer };
