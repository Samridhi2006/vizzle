import { getToken } from "@/lib/client/auth";
import { ApiErrorBody } from "@/types";

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers = new Headers(init.headers ?? {});
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`/api${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let payload: ApiErrorBody = { error: response.statusText };
    try {
      payload = (await response.json()) as ApiErrorBody;
    } catch {
      // keep fallback
    }
    const error = new Error(payload.error) as Error & {
      status: number;
      body: ApiErrorBody;
    };
    error.status = response.status;
    error.body = payload;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
