import { QueryClient, QueryFunction } from "@tanstack/react-query";

// In-memory store for the CSRF token
let csrfToken: string | null = null;

// Function to get the CSRF token from response headers
function getCsrfToken(res: Response) {
  const token = res.headers.get("x-csrf-token");
  if (token) {
    csrfToken = token;
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  method: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: HeadersInit = data ? { "Content-Type": "application/json" } : {};
  if (csrfToken) {
    headers['x-csrf-token'] = csrfToken;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  // After any request, try to update the CSRF token
  getCsrfToken(res);

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> = 
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers: HeadersInit = {};
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }

    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    // After any request, try to update the CSRF token
    getCsrfToken(res);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
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
