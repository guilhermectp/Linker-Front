import type { TRequestError } from "~/types/requests";

export const getErrorStatus = (err: unknown) => {
  const error = err as TRequestError;
  return error?.data?.statusCode ?? error?.statusCode ?? 0;
};

export const getErrorMessage = (err: unknown) => {
  const error = err as TRequestError;
  return error?.data?.message ?? error?.message ?? "Erro desconhecido";
};
