import { QueryClient, QueryFunction } from "@tanstack/react-query";

// In dev: empty string (same-origin Express server on port 5000)
// In production (Cloudflare Pages): VITE_API_URL points to the Render backend
// Trailing slashes are stripped so callers can safely concatenate "/api/...".
const RAW_BASE = import.meta.env.VITE_API_URL ?? "";
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Defensive guard: when VITE_API_URL is unset on a static host, the SPA's
// catch-all route will serve index.html for /api/* — JSON.parse on HTML throws
// a confusing SyntaxError. Detect that case and surface a clear message.
async function parseJsonOrFail(res: Response, url: string) {
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const preview = (await res.text()).slice(0, 80);
    throw new Error(
      `Expected JSON from ${url} but got ${contentType || "no content-type"}. ` +
      `Is VITE_API_URL set correctly? First bytes: ${preview}`,
    );
  }
  return res.json();
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Helper for GETs — every read-only API call should go through this so the
// API_BASE is applied uniformly and HTML-instead-of-JSON is caught early.
// Returns `any` to match the legacy fetch().then(r => r.json()) signature
// callers expect; tighten with explicit casts at call sites if needed.
export async function apiGet(url: string): Promise<any> {
  const fullUrl = `${API_BASE}${url}`;
  const res = await fetch(fullUrl, { credentials: "include" });
  await throwIfResNotOk(res);
  return parseJsonOrFail(res, fullUrl);
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const fullUrl = `${API_BASE}${queryKey.join("/")}`;
    const res = await fetch(fullUrl, { credentials: "include" });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return parseJsonOrFail(res, fullUrl);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
