const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4001'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  status?: number
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ErrorPayload {
  message?: unknown
}

function getErrorMessage(payload: unknown, status: number): string {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload
  ) {
    const message = (payload as ErrorPayload).message
    if (typeof message === 'string') {
      return message
    }
  }

  return `Request failed with status ${status}`
}

export const baseAPI = async <T>(
  url: string,
  method: HttpMethod,
  body?: unknown,
): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(`${baseUrl}/user${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data: unknown;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error('Invalid JSON response from server');
    }

    if (!res.ok) {
      return {
        success: false,
        message: getErrorMessage(data, res.status),
        status: res.status,
      }
    }

    return {
      success: true,
      message: 'Request successful',
      data: data as T,
      status: res.status,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';

    return {
      success: false,
      message,
    }
  }
}
