import { getApiApp } from '../../src/server/createApiApp';

let cachedApp: ReturnType<typeof getApiApp> | null = null;

function resolveNormalizedUrl(req: any, fixedPath?: string): string {
  const rawUrl = typeof req?.url === 'string' && req.url.trim() ? req.url.trim() : '/';
  let parsed: URL;
  try {
    parsed = new URL(rawUrl, 'http://localhost');
  } catch {
    parsed = new URL('/', 'http://localhost');
  }

  const params = new URLSearchParams(parsed.search);
  const rewrittenPath = params.get('__apiPath');
  if (rewrittenPath !== null) {
    params.delete('__apiPath');
  }

  let pathname = parsed.pathname || '/';
  if (fixedPath) {
    pathname = fixedPath;
  } else if (rewrittenPath !== null) {
    const cleanSuffix = rewrittenPath.replace(/^\/+/, '');
    pathname = cleanSuffix ? `/api/${cleanSuffix}` : '/api';
  } else if (!pathname.startsWith('/api')) {
    pathname = '/api' + (pathname.startsWith('/') ? pathname : `/${pathname}`);
  }

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function createVercelHandler(fixedPath?: string) {
  return function vercelApiHandler(req: any, res: any) {
    const requestId =
      (typeof req?.headers?.['x-vercel-id'] === 'string' && req.headers['x-vercel-id'].trim()) ||
      (typeof req?.headers?.['x-request-id'] === 'string' && req.headers['x-request-id'].trim()) ||
      `req_${Date.now().toString(36)}`;
    try {
      if (!cachedApp) {
        cachedApp = getApiApp();
      }
      if (req) {
        req.url = resolveNormalizedUrl(req, fixedPath);
      }
      return cachedApp(req, res);
    } catch (err: any) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Failed to initialize backend API handler.';
      console.error('[VercelAPIHandler] Initialization/execution error:', { requestId, message });
      if (res && !res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('X-Request-Id', requestId);
        res.end(
          JSON.stringify({
            success: false,
            message,
            error: message,
            code: 'API_HANDLER_ERROR',
            requestId
          })
        );
      }
    }
  };
}
