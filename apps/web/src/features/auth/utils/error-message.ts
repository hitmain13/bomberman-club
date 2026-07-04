import { ApiError } from "@bomberman/sdk";

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Credenciais inválidas.";
    }
    if (error.status === 409) {
      return error.message || "Conflito ao processar a solicitação.";
    }
    if (error.status === 422 && error.details) {
      const details = Object.values(error.details).join(" ").trim();
      return details || "Dados inválidos. Verifique os campos.";
    }
    if (error.status >= 500) {
      return "Erro no servidor. Tente novamente em instantes.";
    }
    const message = error.message.trim();
    return message || "Não foi possível concluir agora. Tente novamente.";
  }
  if (error instanceof Error) {
    const message = error.message.trim();
    return message || "Não foi possível concluir agora. Tente novamente.";
  }
  return "Não foi possível concluir agora. Tente novamente.";
}
