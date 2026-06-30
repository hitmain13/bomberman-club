import { Elysia } from "elysia";

import { AppError } from "@/common/errors";
import { logger } from "@/config/logger";

interface ErrorBody {
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

export const errorHandlerPlugin = new Elysia({ name: "error-handler" }).onError(
  ({ error, set, request }) => {
    if (error instanceof AppError) {
      set.status = error.status;
      const body: ErrorBody = {
        error: error.details
          ? { code: error.code, message: error.message, details: error.details }
          : { code: error.code, message: error.message },
      };
      return body;
    }

    logger.error({ err: error, url: request.url }, "unhandled_error");
    set.status = 500;
    const body: ErrorBody = {
      error: { code: "internal_error", message: "Unexpected error" },
    };
    return body;
  },
);
