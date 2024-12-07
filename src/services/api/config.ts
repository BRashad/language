export const API_CONFIG = {
  WIKTIONARY_API: 'https://en.wiktionary.org/w/api.php',
  ETIMOLOJI_API: 'https://raw.githubusercontent.com/btk/etimolojiturkce-api/master/words',
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  REQUEST_TIMEOUT: 15000
};

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public isRetryable: boolean = true
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retries = API_CONFIG.RETRY_ATTEMPTS
): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin,
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new APIError(
        `HTTP error! status: ${response.status}`,
        response.status,
        'HTTP_ERROR',
        response.status >= 500
      );
    }

    return response;
  } catch (error) {
    if (error instanceof APIError && error.isRetryable && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}