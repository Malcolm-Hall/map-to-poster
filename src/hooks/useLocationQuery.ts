import { citySearch, coordinateSearch } from "@/lib/nominatim";
import type {
  CoordinateLookup,
  LocationLookup,
  Lookup,
} from "@/models/generation";
import { useQuery } from "@tanstack/react-query";

export default function useLocationQuery(lookup: Lookup) {
  const isLocationLookup = lookup.type === "location";

  const locationQuery = useQuery({
    queryKey: [
      "nominatim",
      "search",
      isLocationLookup ? [lookup.city, lookup.country] : [],
    ],
    queryFn: async () => {
      const config = lookup as LocationLookup;
      const place = await citySearch(config.city, config.country);
      return {
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
        city: place.address.city,
        country: place.address.country,
      };
    },
    enabled: isLocationLookup,
  });

  const coordinateQuery = useQuery({
    queryKey: [
      "nominatim",
      "reverse",
      !isLocationLookup ? [lookup.latitude, lookup.longitude] : [],
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
    enabled: !isLocationLookup,
  });

  if (isLocationLookup) {
    return locationQuery;
  }

  return coordinateQuery;
}
