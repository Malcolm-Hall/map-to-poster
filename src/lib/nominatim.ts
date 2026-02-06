import type { NominatimPlace } from "@/models/nominatim";

export async function search(
  city: string,
  country: string,
): Promise<NominatimPlace[]> {
  const params = new URLSearchParams({
    q: `${city}, ${country}`,
    format: "jsonv2",
    limit: "1",
  });
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
  );
  return await response.json();
}
