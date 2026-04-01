/**
 * Client-side fetch to same-origin API routes without HTTP cache.
 */
export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, { cache: "no-store", ...init });
}
