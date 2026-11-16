export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
  code?: string;
  requestId?: string;
}

const SENSITIVE_PATTERN = /(rzp_(live|test)_[A-Za-z0-9]+|whsec_[A-Za-z0-9]+|-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----)/g;

function sanitizeErrorText(text: string): string {
  return text.replace(SENSITIVE_PATTERN, '[REDACTED]').trim();
}

/**
 * Safely extracts a human-readable error message from nested API responses,
 * Vercel error payloads, Razorpay error objects, Axios errors, or thrown values.
 * Never returns "[object Object]" and redacts accidental credential patterns.
 */
export function extractErrorMessage(
  input: unknown,
  fallback = 'An unexpected error occurred. Please try again.',
  depth = 0
): string {
  if (depth > 5 || input === null || input === undefined) {
    return fallback;
  }

  if (typeof input === 'string') {
    const cleaned = sanitizeErrorText(input);
    if (!cleaned || cleaned === '[object Object]') {
      return fallback;
    }
    return cleaned;
  }

  if (typeof input === 'number' || typeof input === 'boolean') {
    return String(input);
  }

  if (Array.isArray(input)) {
    const parts = input
      .map(item => extractErrorMessage(item, '', depth + 1))
      .filter(Boolean);
    return parts.length > 0 ? parts.join('; ') : fallback;
  }

  if (input instanceof Error) {
    const errAny = input as any;
    if (errAny?.response?.data) {
      const nested = extractErrorMessage(errAny.response.data, '', depth + 1);
      if (nested) return nested;
    }
    if (errAny?.error) {
      const nested = extractErrorMessage(errAny.error, '', depth + 1);
      if (nested) return nested;
    }
    const msg = extractErrorMessage(input.message, '', depth + 1);
    return msg || fallback;
  }

  if (typeof input === 'object') {
    const obj = input as Record<string, unknown>;
    const candidateKeys = [
      'response',
      'data',
      'error',
      'message',
      'description',
      'reason',
      'details',
      'detail',
      'statusText'
    ];

    for (const key of candidateKeys) {
      if (obj[key] !== undefined && obj[key] !== null) {
        const extracted = extractErrorMessage(obj[key], '', depth + 1);
        if (extracted) {
          return extracted;
        }
      }
    }

    // Fallback: join readable primitive properties rather than returning [object Object]
    const readablePairs: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && v.trim() && v !== '[object Object]') {
        readablePairs.push(`${k}: ${sanitizeErrorText(v)}`);
      } else if (typeof v === 'number' || typeof v === 'boolean') {
        readablePairs.push(`${k}: ${v}`);
      }
      if (readablePairs.length >= 3) break;
    }
    if (readablePairs.length > 0) {
      return readablePairs.join(' | ');
    }
  }

  return fallback;
}

/**
 * Safely performs a fetch request and parses JSON without throwing on
 * empty bodies, HTML fallback pages (e.g. 404/405 SPA rewrites), or nested error objects.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options?.headers || {})
      }
    });
  } catch (networkErr: unknown) {
    const rawMsg = extractErrorMessage(networkErr, '');
    return {
      ok: false,
      status: 0,
      data: null,
      error:
        rawMsg && !rawMsg.includes('Failed to fetch')
          ? rawMsg
          : 'Unable to reach the payment & order server. Please check your internet connection and try again.',
      code: 'NETWORK_ERROR'
    };
  }

  const responseRequestId = res.headers.get('x-request-id') || res.headers.get('x-vercel-id') || undefined;

  let rawText = '';
  try {
    rawText = await res.text();
  } catch {
    console.error('[API Error]', { url, status: res.status, code: 'RESPONSE_READ_ERROR', requestId: responseRequestId });
    return {
      ok: false,
      status: res.status,
      data: null,
      error: `Failed to read server response (HTTP ${res.status}).`,
      code: 'RESPONSE_READ_ERROR',
      requestId: responseRequestId
    };
  }

  const trimmed = rawText.trim();
  const contentType = (res.headers.get('content-type') || '').toLowerCase();

  if (!trimmed) {
    if (!res.ok) {
      console.error('[API Error]', { url, status: res.status, code: `EMPTY_RESPONSE_${res.status}`, requestId: responseRequestId });
    }
    return {
      ok: res.ok,
      status: res.status,
      data: null,
      error: res.ok
        ? null
        : `The checkout API returned an empty response (HTTP ${res.status}). Please verify API serverless routing or try again.`,
      code: res.ok ? undefined : `EMPTY_RESPONSE_${res.status}`,
      requestId: responseRequestId
    };
  }

  if (
    contentType.includes('text/html') ||
    trimmed.startsWith('<!doctype') ||
    trimmed.startsWith('<html') ||
    trimmed.startsWith('<')
  ) {
    console.error('[API Error]', { url, status: res.status, code: `HTML_RESPONSE_${res.status}`, requestId: responseRequestId });
    return {
      ok: false,
      status: res.status,
      data: null,
      error: `The server returned a web page instead of API JSON (HTTP ${res.status}). Please ensure the backend /api serverless functions are deployed on Vercel.`,
      code: `HTML_RESPONSE_${res.status}`,
      requestId: responseRequestId
    };
  }

  let parsed: any = null;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    const plainFallback = !res.ok && trimmed.length > 0 && trimmed.length < 220 ? sanitizeErrorText(trimmed) : '';
    console.error('[API Error]', { url, status: res.status, code: `NON_JSON_${res.status}`, requestId: responseRequestId });
    return {
      ok: false,
      status: res.status,
      data: null,
      error: plainFallback
        ? `Server error (HTTP ${res.status}): ${plainFallback}`
        : `Received an invalid JSON response from the server (HTTP ${res.status}).`,
      code: res.ok ? 'INVALID_JSON' : `NON_JSON_${res.status}`,
      requestId: responseRequestId
    };
  }

  const effectiveRequestId =
    typeof parsed?.requestId === 'string' ? parsed.requestId : responseRequestId;

  if (!res.ok || (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.success === false)) {
    const message = extractErrorMessage(
      parsed,
      `Request failed with status ${res.status}.`
    );
    const code =
      typeof parsed?.code === 'string'
        ? parsed.code
        : typeof parsed?.error?.code === 'string'
        ? parsed.error.code
        : undefined;
    console.error('[API Error]', {
      url,
      status: res.status,
      code,
      requestId: effectiveRequestId,
      message
    });
    return {
      ok: false,
      status: res.status,
      data: parsed as T,
      error: message,
      code,
      requestId: effectiveRequestId
    };
  }

  return {
    ok: true,
    status: res.status,
    data: parsed as T,
    error: null,
    requestId: effectiveRequestId
  };
}
