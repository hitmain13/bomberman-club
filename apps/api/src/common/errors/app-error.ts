export type AppErrorCode =
  | "validation_error"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "internal_error";

export interface AppErrorOptions {
  code: AppErrorCode;
  status: number;
  message: string;
  details?: Record<string, string>;
}

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly status: number;
  public readonly details: Record<string, string> | undefined;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = "AppError";
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, string>) {
    super({
      code: "validation_error",
      status: 422,
      message,
      ...(details ? { details } : {}),
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super({ code: "unauthorized", status: 401, message });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super({ code: "forbidden", status: 403, message });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super({
      code: "not_found",
      status: 404,
      message: id ? `${resource} not found: ${id}` : `${resource} not found`,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super({ code: "conflict", status: 409, message });
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super({ code: "rate_limited", status: 429, message });
  }
}
