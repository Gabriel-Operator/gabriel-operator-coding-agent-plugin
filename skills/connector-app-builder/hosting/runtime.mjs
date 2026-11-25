// UI hosting bridge. All agent, connector, data and sharing decisions stay on Gabriel.
const suffixes = new Map([
  ['GET /api/app/launch', ''],
  ['GET /api/app/hosting', 'hosting'],
  ['GET /api/app/data', '/data'],
  ['POST /api/app/bridge', '/bridge'],
  ['POST /api/app/resource', '/resource'],
]);
const responseHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'Content-Type': 'application/json',
};
const maxBodyBytes = 1_048_576;

function bridgeError(status, message) {
  return Object.assign(new Error(message), { status });
}

async function readBody(stream, parsedBody) {
  if (parsedBody !== undefined) {
    const body = typeof parsedBody === 'string' ? parsedBody : JSON.stringify(parsedBody);
    if (new TextEncoder().encode(body).byteLength > maxBodyBytes) throw bridgeError(413, 'App requests are limited to 1 MB.');
    return body;
  }

  if (!stream) return '';
  const decoder = new TextDecoder();
  let size = 0;
  let body = '';
  for await (const chunk of stream) {
    size += chunk.byteLength;
    if (size > maxBodyBytes) throw bridgeError(413, 'App requests are limited to 1 MB.');
    body += decoder.decode(chunk, { stream: true });
  }
  return body + decoder.decode();
}

function createBridge(config, { backendUrl, allowLocalBackend = false, fetcher }) {
  const base = new URL(backendUrl || config.backendUrl);
  const localBackend = allowLocalBackend && base.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(base.hostname);
  if (base.username || base.password || base.search || base.hash || base.pathname !== '/' || (base.protocol !== 'https:' && !localBackend)) {
    throw new Error('Configure a Gabriel HTTPS backend origin without credentials or a path.');
  }
  if (!/^[a-zA-Z0-9_-]{1,160}$/.test(config.installationId)) throw new Error('Invalid app installation.');
  const launch = new URL(`/api/studio-apps/connectors/launch/${config.installationId}`, base).href;
  const cookieName = `studio_visitor_${config.installationId.slice(0, 16)}`;
  const visitorCookie = raw => String(raw || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`)) || '';
  const cookies = ({ headers }) => (
    headers.getSetCookie?.() ?? headers.getAll?.('Set-Cookie') ?? [headers.get('Set-Cookie')].filter(Boolean)
  ).filter(value => value.startsWith(`${cookieName}=`));
  const rewriteCookie = value => value.replace(/;\s*domain=[^;]*/ig, '').replace(/;\s*path=[^;]*/ig, '; Path=/api/app');
  const request = async (url, options = {}, timeoutMs = 105000) => {
    const response = await fetcher(url, { ...options, redirect: 'manual', signal: AbortSignal.timeout(timeoutMs) });
    if (response.status >= 300 && response.status < 400) throw bridgeError(502, 'The Gabriel backend redirected. Configure its final HTTPS origin.');
    const data = await response.json();
    if (!response.ok) throw bridgeError(response.status, data.error?.message || 'The Gabriel backend is unavailable.');
    return { response, data };
  };

  return async ({ method, url, host, getHeader, getBody }) => {
    let setCookies = [];
    const send = (status, data) => ({ status, data, setCookies });
    const fail = (status, message) => send(status, { success: false, error: { message } });
    const pathname = new URL(url, 'http://bridge.invalid').pathname;
    if (method === 'GET' && pathname === '/api/health') return send(200, { success: true });
    const suffix = suffixes.get(`${method} ${pathname}`);
    if (suffix === undefined) return fail(404, 'Unknown app operation.');
    if (method === 'POST' && (!/^application\/json(?:;|$)/i.test(getHeader('content-type') || '') || getHeader('sec-fetch-site') === 'cross-site')) {
      return fail(403, 'Open the app to use this action.');
    }
    const origin = getHeader('origin');
    if (origin) {
      try {
        if (new URL(origin).host !== host) return fail(403, 'Use this app’s own origin.');
      } catch {
        return fail(403, 'Invalid origin.');
      }
    }

    try {
      // Never forward account Authorization, other cookies, arbitrary URLs or management calls.
      let cookie = visitorCookie(getHeader('cookie'));
      const meta = await request(launch, { headers: cookie ? { Cookie: cookie } : {} }, 15000);
      if (meta.data.data?.id !== config.installationId) throw bridgeError(502, 'The configured Gabriel backend returned a different app.');
      if (meta.data.data?.sharingMode !== 'public') throw bridgeError(403, 'This exported UI requires the app owner’s current Public sharing approval on Gabriel.');
      if (meta.data.data.appRevision !== config.appRevision) throw bridgeError(409, 'The Gabriel app revision changed. Export its current UI again.');
      const fresh = cookies(meta.response);
      if (fresh.length) {
        setCookies = fresh.map(rewriteCookie);
        cookie = visitorCookie(fresh[0]);
      }
      if (!suffix) return send(200, meta.data);
      if (suffix === 'hosting') {
        return send(200, { success: true, data: { installationId: config.installationId, appRevision: config.appRevision, backendUrl: base.origin, ready: true } });
      }
      let body;
      if (method === 'POST') {
        body = await getBody();
        try { JSON.parse(body); } catch { throw bridgeError(400, 'Send a valid JSON app request.'); }
      }
      const headers = cookie ? { Cookie: cookie } : {};
      if (body) headers['Content-Type'] = 'application/json';
      const result = await request(launch + suffix, { method, headers, ...(body ? { body } : {}) });
      const refreshed = cookies(result.response);
      if (refreshed.length) setCookies = refreshed.map(rewriteCookie);
      return send(200, result.data);
    } catch (error) {
      return fail(error.status || 502, error.status ? error.message : 'This app could not reach its Gabriel backend.');
    }
  };
}

export function createAppBridge(config, fetcher = fetch) {
  const bridge = createBridge(config, {
    backendUrl: process.env.GABRIEL_BACKEND_URL,
    allowLocalBackend: process.env.NODE_ENV === 'development',
    fetcher,
  });
  return async (req, res) => {
    const result = await bridge({
      method: req.method,
      url: req.url,
      host: req.headers.host,
      getHeader: name => req.headers[name],
      getBody: () => readBody(req, req.body),
    });
    for (const [key, value] of Object.entries(responseHeaders)) res.setHeader(key, value);
    if (result.setCookies.length) res.setHeader('Set-Cookie', result.setCookies);
    res.statusCode = result.status;
    res.end(JSON.stringify(result.data));
  };
}

export async function handleWorkerAppRequest(request, config, backendUrl, fetcher = fetch) {
  let bridge;
  try {
    bridge = createBridge(config, { backendUrl, fetcher });
  } catch (error) {
    return Response.json({ success: false, error: { message: error.message } }, { status: 502, headers: responseHeaders });
  }
  const result = await bridge({
    method: request.method,
    url: request.url,
    host: new URL(request.url).host,
    getHeader: name => request.headers.get(name),
    getBody: () => readBody(request.body),
  });
  const headers = new Headers(responseHeaders);
  for (const cookie of result.setCookies) headers.append('Set-Cookie', cookie);
  return Response.json(result.data, { status: result.status, headers });
}
