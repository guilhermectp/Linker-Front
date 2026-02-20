import type { AsyncDataOptions } from "#app";
import type { NitroFetchOptions, AvailableRouterMethod } from "nitropack";

type ApiAsyncOptions<T> = AsyncDataOptions<T> &
  Omit<
    NitroFetchOptions<any, AvailableRouterMethod<any>>,
    "onRequest" | "onResponse" | "onResponseError" | "onRequestError"
  >;
// Omitir os interceptors para decidir tratar eles globalmente no useApi

export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useCookie("access_token");
  const baseURL = config.public.API_BASE;

  const getFetchOptions = (customOptions: NitroFetchOptions<any>) => {
    const { baseURL: customBaseURL, ...rest } = customOptions;
    return {
      baseURL: customBaseURL ?? baseURL,
      headers: {
        ...(token.value && { Authorization: `Bearer ${token.value}` }),
        "Content-Type": "application/json",
        ...rest.headers,
      },
      ...rest,
    };
  };

  const asyncFetch = <T = unknown, E = unknown>(
    key: string,
    path: string,
    options: ApiAsyncOptions<T> = {},
  ) => {
    const {
      server,
      lazy,
      immediate,
      deep,
      dedupe,
      default: defaultData,
      transform,
      pick,
      watch,
      getCachedData,
      ...fetchOptions
    } = options;

    return useAsyncData<T, E>(
      key,
      () => $fetch<T>(path, getFetchOptions(fetchOptions)),
      {
        server,
        lazy,
        immediate,
        deep,
        dedupe,
        default: defaultData,
        transform,
        pick,
        watch,
        getCachedData,
      },
    );
  };

  const fetchApi = <T = unknown>(
    path: string,
    options: NitroFetchOptions<any>,
  ) => {
    return $fetch<T>(path, getFetchOptions({ method: "GET", ...options }));
  };

  return { asyncFetch, fetchApi };
};
