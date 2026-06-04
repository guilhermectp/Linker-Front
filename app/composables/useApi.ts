import type { NitroFetchOptions } from "nitropack";
import type {
  TApiOptions,
  TAsyncApiOptions,
  TRequestError,
} from "~/types/requests";

const getFetchOptions = (customOptions: NitroFetchOptions<any>) => {
  const config = useRuntimeConfig();
  const token = useCookie("access_token");
  const baseURL = config.public.API_BASE;

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

export const useAsyncApi = <T = unknown>(
  key: MaybeRefOrGetter<string>,
  path: string,
  options: TAsyncApiOptions<T> = {},
) => {
  const canFetch = () => {
    const required = toValue(options.requiredFilters) ?? [];

    return required.every((key: string) => {
      const val = toValue(options.query?.[key]);
      return val !== undefined && val !== null && val !== "";
    });
  };

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

  return useAsyncData<T, TRequestError>(
    key,
    (): Promise<T> => {
      if (!canFetch()) {
        return Promise.resolve(null as T);
      }

      const { query, ...resolvedOptions } = toValue(fetchOptions);

      const resolvedQuery: Record<string, any> = {};
      if (query) {
        for (const key in query) {
          resolvedQuery[key] = toValue(query[key]);
        }
      }

      return $fetch<T>(
        path,
        getFetchOptions({ ...resolvedOptions, query: resolvedQuery }),
      ) as Promise<T>;
    },
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

export const useApi = async <T = unknown>(
  path: string,
  options: TApiOptions = {},
): Promise<T> => {
  return $fetch<T>(path, getFetchOptions(options)) as Promise<T>;
};
