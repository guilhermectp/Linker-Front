import type { TErrorApi } from "~/types/requestError";

export const getErrorMessageApi = (error: TErrorApi | any) => {
  return getErrorStatus(error)
    ? `${getErrorStatus(error)} - ${getErrorMessage(error)}`
    : getErrorMessage(error);
};

export const getErrorStatus = (error: any) => {
  return error?.data?.statusCode ?? error?.statusCode ?? error?.status;
};

export const getErrorMessage = (error: any) => {
  return error?.data?.message ?? error?.message ?? "Erro desconhecido";
};
