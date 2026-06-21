export async function fetchWithTimeout(
  resource: string | URL | Request,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 8000, ...rest } = options;

  const controller = new AbortController();
  let isTimeout = false;
  const id = setTimeout(() => {
    isTimeout = true;
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(resource, {
      ...rest,
      signal: controller.signal,
    });
    return response;
  } catch (err: unknown) {
    if (isTimeout || (err instanceof DOMException && err.name === "AbortError")) {
      throw new Error(`Yêu cầu bị quá thời gian chờ (${timeout}ms). Vui lòng kiểm tra kết nối Server.`);
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}
