export async function fetchWithTimeout(
  resource: string | URL | Request,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 8000, ...rest } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...rest,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}
