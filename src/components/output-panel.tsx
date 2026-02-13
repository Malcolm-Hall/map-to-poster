import {
  fetchMapData,
  bboxFromPoint,
  fetchWaterData,
  fetchParkData,
} from "@/lib/osm";
import { type GenerationConfig } from "@/models/generation";
import { useQuery } from "@tanstack/react-query";
import MapCanvas from "./map-canvas";
import type { GeometryElement } from "@/models/osm";
import useLocationQuery from "@/hooks/useLocationQuery";
import { formatPosterText } from "@/lib/utils";

type Props = {
  config: GenerationConfig;
};

export default function OutputPanel({ config }: Props) {
  const locationQuery = useLocationQuery(config.lookup);

  const bbox = bboxFromPoint(
    locationQuery.data ?? { lat: 0, lon: 0 },
    config.radiusMeters,
    config.resolution,
  );

  const mapQuery = useQuery({
    queryKey: ["osm", "map", bbox],
    queryFn: async () => {
      const data = await fetchMapData(bbox);
      const elements = data.elements.filter((el): el is GeometryElement =>
        el.hasOwnProperty("geometry"),
      );
      return elements;
    },
    enabled: !!locationQuery.data,
  });

  const waterQuery = useQuery({
    queryKey: ["osm", "water", bbox],
    queryFn: async () => {
      const data = await fetchWaterData(bbox);
      const elements = data.elements.filter((el): el is GeometryElement =>
        el.hasOwnProperty("geometry"),
      );
      return elements;
    },
    enabled:
      !!locationQuery.data && !!mapQuery.data && !!config.showWaterFeatures,
  });

  const parkQuery = useQuery({
    queryKey: ["osm", "park", bbox],
    queryFn: async () => {
      const data = await fetchParkData(bbox);
      const elements = data.elements.filter((el): el is GeometryElement =>
        el.hasOwnProperty("geometry"),
      );
      return elements;
    },
    enabled:
      !!locationQuery.data && !!mapQuery.data && !!config.showParkFeatures,
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

  if (config.showParkFeatures && !parkQuery.data)
    return (
      <div className="p-4 text-red-500">No park feature data available</div>
    );

  if (config.showParkFeatures && parkQuery.isPending)
    return <div className="p-4">Generating park features...</div>;

  if (config.showParkFeatures && parkQuery.error)
    return (
      <div className="p-4 text-red-500">Error: {parkQuery.error.message}</div>
    );

  if (config.showParkFeatures && !parkQuery.data)
    return (
      <div className="p-4 text-red-500">No park feature data available</div>
    );

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">
        {locationQuery.data.city}, {locationQuery.data.country}
      </h2>
      <MapCanvas
        elements={mapQuery.data}
        waterElements={config.showWaterFeatures ? (waterQuery.data ?? []) : []}
        parkElements={config.showParkFeatures ? (parkQuery.data ?? []) : []}
        bbox={bbox}
        resolution={config.resolution}
        displayConfig={formatPosterText(locationQuery.data)}
      />
    </div>
  );
}
