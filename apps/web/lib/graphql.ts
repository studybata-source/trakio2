export async function gqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const apiUrl = process.env.API_URL || 'http://localhost:4000/';
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GraphQL error: ${res.status} ${text}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data as T;
}