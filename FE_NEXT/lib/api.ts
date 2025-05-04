// lib/api.ts

/**
 * Fetch data from an API endpoint with optional request options
 * @param url The URL to fetch data from
 * @param options Optional request options
 * @returns The JSON response from the API
 */
export async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
  
      // Handle non-2xx responses
      if (!response.ok) {
        const error = new Error(`API request failed with status ${response.status}`);
        throw error;
      }
  
      return await response.json() as T;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  