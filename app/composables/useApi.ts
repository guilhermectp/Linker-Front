export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.API_BASE;

  const getHeaders = (additionalHeaders: any = {}) => {
    const token = useCookie("access_token").value;
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      ...additionalHeaders,
    };
  };

  const asyncFetch = <T>(path: string, options: any = {}) => {
    const fetchKey = toValue(options.key) || `api-${path}`;

    return useAsyncData<T>(
      fetchKey,
      () =>
        $fetch<T>(path, {
          ...options,
          baseURL,
          headers: getHeaders(options.headers),
        }),
      {
        lazy: options.lazy ?? false,
        watch: options.watch || [],
        ...options.asyncDataOptions,
      },
    );
  };

  const fetch = async <T>(path: string, options: any = {}) => {
    try {
      const data = await $fetch<T>(path, {
        ...options,
        baseURL,
        headers: getHeaders(options.headers),
      });
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: {
          status: error?.response?.status,
          message:
            error?.data?.message || error?.message || "Erro desconhecido",
        },
      };
    }
  };

  return { asyncFetch, fetch };
};
