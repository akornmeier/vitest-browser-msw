import * as msw_browser from 'msw/browser';
import * as msw from 'msw';

declare const handlers: msw.HttpHandler[];

declare const worker: msw_browser.SetupWorker;
declare function startWorker(options?: {}): Promise<ServiceWorkerRegistration | undefined>;

export { handlers, startWorker, worker };
