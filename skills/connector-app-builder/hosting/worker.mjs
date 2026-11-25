import config from './gabriel-host.json' with { type: 'json' };
import { handleWorkerAppRequest } from './runtime.mjs';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith('/api/')) return handleWorkerAppRequest(request, config, env.GABRIEL_BACKEND_URL);
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405 });
    return env.ASSETS.fetch(request);
  },
};
