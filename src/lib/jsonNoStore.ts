import { NextResponse } from "next/server";

/**
 * JSON responses for App Router route handlers with no CDN/browser caching.
 */
export function jsonNoStore(
  body: unknown,
  init?: { status?: number; headers?: HeadersInit }
) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");
  return NextResponse.json(body, { status: init?.status, headers });
}
