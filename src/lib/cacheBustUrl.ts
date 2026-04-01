/**
 * Appends a cache-busting query param so updated images at the same path
 * (e.g. public files) are not served stale from the browser or CDN.
 */
export function cacheBustUrl(url: string, version?: string | number): string {
  if (!url || typeof url !== "string") return url;
  const trimmed = url.trim();
  if (trimmed.length === 0) return url;
  const t = version ?? Date.now();
  const sep = trimmed.includes("?") ? "&" : "?";
  return `${trimmed}${sep}t=${t}`;
}
