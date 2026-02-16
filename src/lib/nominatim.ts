import type { NominatimPlace } from "@/models/nominatim";

export async function citySearch(
  city: string,
  country: string,
): Promise<NominatimPlace> {
  const params = new URLSearchParams({
    city,
    country,
    addressdetails: "1",
    featureType: "city",
    format: "jsonv2",
    limit: "1",
  });
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
  );
  const data: NominatimPlace[] = await response.json();
  return data[0];
}

export async function coordinateSearch(
  lat: number,
  lon: number,
): Promise<NominatimPlace> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    zoom: "10",
    layer: "address",
    addressdetails: "1",
    format: "jsonv2",
  });
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
  );
  return await response.json();
}
