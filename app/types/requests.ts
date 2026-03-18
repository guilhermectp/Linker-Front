import type { AsyncDataOptions } from "#app";
import type { NitroFetchOptions, AvailableRouterMethod } from "nitropack";
import type { FetchError } from "ofetch";

export type TAsyncApiOptions<T> = AsyncDataOptions<T> &
  Omit<
    NitroFetchOptions<string, AvailableRouterMethod<string>>,
    "onRequest" | "onResponse" | "onResponseError" | "onRequestError"
  > & {
    requiredFilters?: MaybeRefOrGetter<string[] | undefined>;
  };

export type TApiOptions = NitroFetchOptions<
  string,
  AvailableRouterMethod<string>
>;

type TError = {
  message: string;
  statusCode: number;
};

export type TRequestError = FetchError<TError>;
