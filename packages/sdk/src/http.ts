import { z } from "zod";

import { ApiError, type ApiErrorPayload } from "./errors";

export interface HttpClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | null;
  onUnauthorized?: () => void;
  fetchImpl?: typeof fetch;
}

interface RequestOptions<TResponseSchema extends z.ZodTypeAny> {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  responseSchema: TResponseSchema;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
}

const errorPayloadSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string()).optional(),
  }),
});

export class HttpClient {
  public readonly baseUrl: string;
  private readonly getAccessToken: () => string | null;
  private readonly onUnauthorized: (() => void) | undefined;
  private readonly fetchImpl: typeof fetch;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.getAccessToken = options.getAccessToken ?? (() => null);
    this.onUnauthorized = options.onUnauthorized;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  authHeader(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return this.fetchImpl(input, init);
  }

  async request<TResponseSchema extends z.ZodTypeAny>(
    options: RequestOptions<TResponseSchema>,
  ): Promise<z.infer<TResponseSchema>> {
    const url = this.buildUrl(options.path, options.query);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = this.getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const init: RequestInit = {
      method: options.method ?? "GET",
      headers,
      credentials: options.credentials ?? "include",
    };
    if (options.body !== undefined) {
      init.body = JSON.stringify(options.body);
    }
    if (options.signal) {
      init.signal = options.signal;
    }

    const response = await this.fetchImpl(url, init);

    if (response.status === 401 && this.onUnauthorized) {
      this.onUnauthorized();
    }

    if (!response.ok) {
      const rawError = (await safeJson(response)) as unknown;
      const parsed = errorPayloadSchema.safeParse(rawError);
      const payload: ApiErrorPayload = parsed.success
        ? toErrorPayload(parsed.data.error)
        : { code: "unknown_error", message: response.statusText };
      throw new ApiError(response.status, payload);
    }

    if (response.status === 204) {
      return options.responseSchema.parse(undefined);
    }

    const data = (await response.json()) as unknown;
    return options.responseSchema.parse(data);
  }

  private buildUrl(path: string, query?: RequestOptions<z.ZodTypeAny>["query"]): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined) {
          continue;
        }
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }
}

function toErrorPayload(input: {
  code: string;
  message: string;
  details?: Record<string, string> | undefined;
}): ApiErrorPayload {
  if (input.details === undefined) {
    return { code: input.code, message: input.message };
  }
  return { code: input.code, message: input.message, details: input.details };
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
