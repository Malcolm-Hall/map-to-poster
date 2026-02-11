import { search } from "@/lib/nominatim";
import { fetchMapData, bboxFromPoint, fetchWaterData } from "@/lib/osm";
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
    queryFn: async () => {
      const place = await search(config.city, config.country);
      const lat = parseFloat(place.lat);
      const lon = parseFloat(place.lon);
      const bbox = bboxFromPoint({ lat, lon }, RADIUS_METERS);
      return {
        place,
        lat,
        lon,
        bbox,
      };
    },
  });

  const mapQuery = useQuery({
    queryKey: ["osm", locationQuery.data?.lat, locationQuery.data?.lon],
    queryFn: async () => {
      if (!locationQuery.data) throw new Error("Location not found");
      const data = await fetchMapData(locationQuery.data.bbox);
      const elements = data.elements.filter((el): el is GeometryElement =>
        el.hasOwnProperty("geometry"),
      );
      return elements;
    },
    enabled: !!locationQuery.data,
  });

  const waterQuery = useQuery({
    queryKey: [
      "osm",
      "water",
      locationQuery.data?.lat,
      locationQuery.data?.lon,
    ],
    queryFn: async () => {
      if (!locationQuery.data) throw new Error("Location not found");
      const data = await fetchWaterData(locationQuery.data.bbox);
      const elements = data.elements.filter((el): el is GeometryElement =>
        el.hasOwnProperty("geometry"),
      );
      return elements;
    },
    enabled:
      !!locationQuery.data && !!mapQuery.data && !!config.showWaterFeatures,
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

  if (config.showWaterFeatures && waterQuery.isPending)
    return <div className="p-4">Generating water features...</div>;

  if (config.showWaterFeatures && waterQuery.error)
    return (
      <div className="p-4 text-red-500">Error: {waterQuery.error.message}</div>
    );

  if (config.showWaterFeatures && !waterQuery.data)
    return (
      <div className="p-4 text-red-500">No water feature data available</div>
    );

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">
        {config.city}, {config.country}
      </h2>
      <MapCanvas
        elements={mapQuery.data}
        waterElements={config.showWaterFeatures ? (waterQuery.data ?? []) : []}
        bbox={locationQuery.data.bbox}
        displayConfig={{
          mainHeading: config.city,
          subHeading: config.country,
          coordinates: formatCoordinates(
            locationQuery.data.lat,
            locationQuery.data.lon,
          ),
        }}
      />
    </div>
  );
}
