
import fetch from 'node-fetch';

export class RequestFactory {
  constructor() {
  }

  private static async _baseRequest(url: string, options: any): Promise<any> {
    try {
      if (options.body) options.body = JSON.stringify(options.body);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${options.token}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        ...options
      });

      if (!res.ok) {
        const data = await res.json();
        return JSON.stringify(data);
      }
      return await res.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public static async postRequest(url: string, options: any) {
    options.method = 'POST';
    return await RequestFactory._baseRequest(url, options);
  }

  public static async getRequest(url: string, options: any) {
    options.method = 'GET';
    return await RequestFactory._baseRequest(url, options);
  }
}