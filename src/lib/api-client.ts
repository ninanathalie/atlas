/**
 * Wrapper for authenticated API calls from the client.
 * Throws with the server error message on non-OK responses.
 */
export async function apiFetch<T = unknown>(url: string, options?: RequestInit): Promise<T> {
 const headers = { "Content-Type": "application/json", ...(options?.headers ?? {}) };
 const response = await fetch(url, {
  ...options,
  headers,
 });

 if (!response.ok) {
  const data = await response.json().catch(() => ({}));
  throw new Error(data.error || `Request failed (${response.status})`);
 }

 return response.json();
}
