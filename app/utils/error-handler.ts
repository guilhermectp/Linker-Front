import type { FriendlyError, FriendlyErrorOptions } from "~/types/errorHandler";

export const getErrorStatus = (error: any) => {
  return (
    error?.status ??
    error?.statusCode ??
    error?.data?.statusCode ??
    error?.response?.status
  );
};

export const getErrorMessage = (error: any) => {
  return (
    error?.message ?? error?.data?.message ?? error?.response?._data?.message
  );
};

export const errorIsAbort = (error: any): boolean => {
  return (
    error?.name === "AbortError" ||
    error?.cause?.name === "AbortError" ||
    error?.message?.includes("aborted")
  );
};

export const getFriendlyError = (
  error?: any,
  options: FriendlyErrorOptions = {},
): FriendlyError => {
  const realStatus = getErrorStatus(error);
  const realError = getErrorStatus(error);
  const status = options.maskStatus ?? realStatus;
  const errorMessage = options.description ?? realError;

  if (status === 400) {
    return {
      title: options.title || "Solicitação inválida",
      description: "Não foi possível processar a solicitação enviada.",
      icon: "lucide:circle-alert",
      color: "warning",
      status,
      showRetry: options.showRetry ?? true,
    };
  }

  if (status === 401) {
    return {
      title: options.title || "Sessão expirada",
      description: "Sua sessão expirou. Faça login novamente para continuar.",
      icon: "lucide:lock-keyhole",
      color: "warning",
      status,
      showRetry: options.showRetry ?? false,
    };
  }

  if (status === 403) {
    return {
      title: options.title || "Acesso não permitido",
      description: "Você não tem permissão para acessar essas informações.",
      icon: "lucide:shield-alert",
      color: "warning",
      status,
      showRetry: options.showRetry ?? false,
    };
  }

  if (status === 404) {
    return {
      title: options.title || "Nenhum dado encontrado",
      description:
        errorMessage || "Não há dados para as informações solicitadas.",
      icon: "lucide:inbox",
      color: "neutral",
      status,
      showRetry: options.showRetry ?? false,
    };
  }

  if (status === 408) {
    return {
      title: options.title || "Tempo de resposta excedido",
      description:
        errorMessage ||
        "A solicitação demorou mais do que o esperado. Tente novamente.",
      icon: "lucide:clock-alert",
      color: "warning",
      status,
      showRetry: options.showRetry ?? true,
    };
  }

  if (status === 409) {
    return {
      title: options.title || "Conflito de dados",
      description:
        errorMessage ||
        "A solicitação não pôde ser concluída por conflito nas informações.",
      icon: "lucide:git-compare-arrows",
      color: "warning",
      status,
      showRetry: options.showRetry ?? true,
    };
  }

  if (status === 422) {
    return {
      title: options.title || "Dados indisponíveis",
      description:
        errorMessage || "Não foi possível processar os dados solicitados.",
      icon: "lucide:file-search",
      color: "warning",
      status,
      showRetry: options.showRetry ?? true,
    };
  }

  if (status === 500) {
    return {
      title: options.title || "Erro no servidor",
      description:
        errorMessage ||
        "Estamos com instabilidade interna. Tente novamente em instantes.",
      icon: "lucide:server-crash",
      color: "error",
      status,
      showRetry: options.showRetry ?? true,
    };
  }

  if (status === 502) {
    return {
      title: options.title || "Falha de conexão",
      description:
        errorMessage || "O serviço de dados demorou muito a responder.",
      icon: "lucide:wifi-off",
      color: "error",
      status,
      showRetry: options.showRetry ?? true,
    };
  }

  if (status === 503) {
    return {
      title: options.title || "Serviço indisponível",
      description:
        errorMessage ||
        "O serviço está temporariamente indisponível. Tente novamente em instantes.",
      icon: "lucide:server-off",
      color: "error",
      status,
      showRetry: options.showRetry ?? true,
    };
  }

  if (status === 504) {
    return {
      title: options.title || "Tempo limite excedido",
      description:
        errorMessage ||
        "O servidor demorou muito para responder. Tente novamente.",
      icon: "lucide:timer-off",
      color: "error",
      status,
      showRetry: options.showRetry ?? true,
    };
  }

  return {
    title: options.title || "Ops! Algo deu errado",
    description: errorMessage || "Não foi possível carregar os dados.",
    icon: "lucide:triangle-alert",
    color: "error",
    status,
    showRetry: options.showRetry ?? true,
  };
};
