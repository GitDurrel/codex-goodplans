import { useFetch } from "../../hooks/useFetch";

export interface VehicleBrand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  vehicle_type?: string | null;
  country?: string | null;
}

export interface VehicleModel {
  id: string;
  name: string;
  slug: string;
  brand_id: string;
  start_year?: number | null;
  end_year?: number | null;
  vehicle_type?: string | null;
}

const BRANDS_BASE_PATH = "/vehicle/brands";

export function useVehicleBrands(options?: {
  vehicleType?: string;
  search?: string;
  skip?: boolean;
}) {
  const params = new URLSearchParams();
  if (options?.vehicleType) params.append("vehicle_type", options.vehicleType);
  if (options?.search) params.append("search", options.search);

  const path = params.toString()
    ? `${BRANDS_BASE_PATH}?${params.toString()}`
    : BRANDS_BASE_PATH;

  // useFetch renvoie typiquement { data, loading, error, ... }
  return useFetch<VehicleBrand[]>(path, { skip: options?.skip });
}

export function useVehicleModels(
  brandId?: string,
  options?: { skip?: boolean }
) {
  const path = brandId ? `/vehicle/brands/${brandId}/models` : "";
  return useFetch<VehicleModel[]>(path, {
    skip: !brandId || options?.skip,
  });
}
