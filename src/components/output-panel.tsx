import { search } from "@/lib/nominatim";
import { fetchMapData, bboxFromPoint } from "@/lib/osm";
import { RADIUS_METERS, type GenerationConfig } from "@/models/generation";
import { useQuery } from "@tanstack/react-query";
import MapCanvas from "./map-canvas";
import { formatCoordinates } from "@/lib/utils";
import type { GeometryElement } from "@/models/osm";

type Props = {
  config: GenerationConfig;
};

export default function OutputPanel({ config }: Props) {
  const locationQuery = useQuery({
    queryKey: ["nominatim", config.city, config.country],
    queryFn: () => search(config.city, config.country),
  });

  const mapQuery = useQuery({
    queryKey: ["osm", locationQuery.data?.lat, locationQuery.data?.lon],
    queryFn: async () => {
      if (!locationQuery.data) throw new Error("Location not found");
      const lat = parseFloat(locationQuery.data.lat);
      const lon = parseFloat(locationQuery.data.lon);
      const bbox = bboxFromPoint({ lat, lon }, RADIUS_METERS);
      const data = await fetchMapData(bbox);
      const elements = data.elements.filter((el): el is GeometryElement =>
        el.hasOwnProperty("geometry"),
      );
      return {
        elements,
        bbox,
        lat,
        lon,
      };
    },
    enabled: !!locationQuery.data,
  });

  if (locationQuery.isPending)
    return <div className="p-4">Searching location...</div>;

  if (locationQuery.error)
    return (
      <div className="p-4 text-red-500">
        Error: {locationQuery.error.message}
      </div>
    );

  if (mapQuery.isPending) return <div className="p-4">Generating map...</div>;

  if (mapQuery.error)
    return (
      <div className="p-4 text-red-500">Error: {mapQuery.error.message}</div>
    );

  if (!mapQuery.data)
    return <div className="p-4 text-red-500">No map data available</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">
        {config.city}, {config.country}
      </h2>
      <MapCanvas
        elements={mapQuery.data.elements}
        bbox={mapQuery.data.bbox}
        displayConfig={{
          mainHeading: config.city,
          subHeading: config.country,
          coordinates: formatCoordinates(mapQuery.data.lat, mapQuery.data.lon),
        }}
      />
    </div>
  );
}
