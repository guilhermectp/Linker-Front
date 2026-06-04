import type { LocationByCep } from "~/types/location";

export const locationService = {
  getLocationByCep(cleanCep: string): Promise<LocationByCep> {
    return useApi("", {
      baseURL: `https://viacep.com.br/ws/${cleanCep}/json/`,
    });
  },
};
