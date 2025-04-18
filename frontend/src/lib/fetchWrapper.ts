export class FetchWrapper {
  private readonly baseUrl: string;
  private readonly headers = new Headers();

  constructor({
    baseUrl,
    accessToken,
  }: {
    baseUrl: string;
    accessToken?: string;
  }) {
    this.baseUrl = baseUrl;
    this.headers.append('Content-Type', 'application/json');

    if (accessToken) {
      this.headers.append('Authorization', `Bearer ${accessToken}`);
    }
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: this.headers,
    });

    return this.handleResponse(response);
  }

  async post<T, D extends Record<string, unknown> | FormData>(
    url: string,
    data: D,
  ): Promise<T> {
    const isFormData = data instanceof FormData;
    let headers;

    if (isFormData) {
      headers = new Headers(this.headers);
      headers.delete('Content-Type');
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      body: isFormData ? (data as FormData) : JSON.stringify(data),
      headers: isFormData ? headers : this.headers,
    });

    return this.handleResponse(response);
  }

  async put<T, D extends Record<string, unknown>>(
    url: string,
    data: D,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: this.headers,
    });

    return this.handleResponse(response);
  }

  async patch<T, D extends Record<string, unknown> | FormData>(
    url: string,
    data: D,
  ): Promise<T> {
    const isFormData = data instanceof FormData;
    let headers;

    if (isFormData) {
      headers = new Headers(this.headers);
      headers.delete('Content-Type');
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'PATCH',
      body: isFormData ? (data as FormData) : JSON.stringify(data),
      headers: isFormData ? headers : this.headers,
    });

    return this.handleResponse(response);
  }

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    return this.handleResponse(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An unexpected error occurred');
    }

    return data as T;
  }
}

export const fetchWrapper = new FetchWrapper({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});
