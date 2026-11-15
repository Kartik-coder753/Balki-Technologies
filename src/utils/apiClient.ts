export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
  code?: string;
}

/**
 * Safely performs a fetch request and parses JSON without throwing on
 * empty bodies, HTML fallback pages (e.g. 404/405 SPA rewrites), or malformed responses.
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
  } catch (networkErr: any) {
    return {
      ok: false,
      status: 0,
      data: null,
      error:
        networkErr?.message && !String(networkErr.message).includes('Failed to fetch')
          ? networkErr.message
          : 'Unable to reach the payment & order server. Please check your internet connection and try again.',
      code: 'NETWORK_ERROR'
    };
  }

  let rawText = '';
  try {
    rawText = await res.text();
  } catch (readErr: any) {
    return {
      ok: false,
      status: res.status,
      data: null,
      error: `Failed to read server response (HTTP ${res.status}).`,
      code: 'RESPONSE_READ_ERROR'
    };
  }

  const trimmed = rawText.trim();
  const contentType = (res.headers.get('content-type') || '').toLowerCase();

  if (!trimmed) {
    return {
      ok: res.ok,
      status: res.status,
      data: null,
      error: res.ok
        ? null
        : `The checkout API returned an empty response (HTTP ${res.status}). Please try again or contact support.`,
      code: res.ok ? undefined : `EMPTY_RESPONSE_${res.status}`
    };
  }

  if (
    contentType.includes('text/html') ||
    trimmed.startsWith('<!doctype') ||
    trimmed.startsWith('<html') ||
    trimmed.startsWith('<')
  ) {
    return {
      ok: false,
      status: res.status,
      data: null,
      error: `The server returned a web page instead of JSON (HTTP ${res.status}). Please verify API deployment routing.`,
      code: `HTML_RESPONSE_${res.status}`
    };
  }

  let parsed: any = null;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return {
      ok: false,
      status: res.status,
      data: null,
      error: `Received an invalid response format from the server (HTTP ${res.status}).`,
      code: 'INVALID_JSON'
    };
  }

  if (!res.ok || (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.success === false)) {
    const message =
      parsed?.message ||
      parsed?.error ||
      `Request failed with status ${res.status}.`;
    return {
      ok: false,
      status: res.status,
      data: parsed as T,
      error: String(message),
      code: parsed?.code
    };
  }

  return {
    ok: true,
    status: res.status,
    data: parsed as T,
    error: null
  };
}
