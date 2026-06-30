import { ApiError } from "@bomberman/sdk";

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Credenciais inválidas.";
    }
    if (error.status === 409) {
      return error.message;
    }
    if (error.status === 422 && error.details) {
      return Object.values(error.details).join(" ");
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Não foi possível concluir agora. Tente novamente.";
}
