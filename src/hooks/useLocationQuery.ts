import { citySearch, coordinateSearch } from "@/lib/nominatim";
import type { CoordinateLookup, CityLookup, Lookup } from "@/models/generation";
import { useQuery } from "@tanstack/react-query";

export type Location = {
  city: string;
  country: string;
  lat: number;
  lon: number;
};

export default function useLocationQuery(lookup: Lookup) {
  const isCityLookup = lookup.type === "city";

  const cityQuery = useQuery<Location>({
    queryKey: [
      "nominatim",
      "search",
      isCityLookup ? [lookup.city, lookup.country] : [],
    ],
    queryFn: async () => {
      const config = lookup as CityLookup;
      const place = await citySearch(config.city, config.country);
      return {
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
        city: place.address.city,
        country: place.address.country,
      };
    },
    enabled: isCityLookup,
  });

  const coordinateQuery = useQuery<Location>({
    queryKey: [
      "nominatim",
      "reverse",
      !isCityLookup ? [lookup.latitude, lookup.longitude] : [],
    ],
    queryFn: async () => {
      const config = lookup as CoordinateLookup;
      const place = await coordinateSearch(config.latitude, config.longitude);
      return {
        lat: config.latitude,
        lon: config.longitude,
        city: place.address.city,
        country: place.address.country,
      };
    },
    enabled: !isCityLookup,
  });

  if (isCityLookup) {
    return cityQuery;
  }

  return coordinateQuery;
}
