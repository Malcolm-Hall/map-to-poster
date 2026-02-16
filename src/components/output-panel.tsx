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
import { Spinner } from "@/components/ui/spinner";

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
    return (
      <div className="flex items-center gap-2">
        <Spinner />
        Fetching location data...
      </div>
    );

  if (locationQuery.error)
    return (
      <div className="text-red-500">
        Error fetching location data: {locationQuery.error.message}
      </div>
    );

  if (mapQuery.isPending)
    return (
      <div className="flex items-center gap-2">
        <Spinner />
        Fetching map data...
      </div>
    );

  if (mapQuery.error)
    return (
      <div className="text-red-500">
        Error fetching map data: {mapQuery.error.message}
      </div>
    );

  if (!mapQuery.data)
    return <div className="text-red-500">No map data available</div>;

  if (config.showWaterFeatures && waterQuery.isPending)
    return (
      <div className="flex items-center gap-2">
        <Spinner />
        Fetching water feature data...
      </div>
    );

  if (config.showParkFeatures && parkQuery.isPending)
    return (
      <div className="flex items-center gap-2">
        <Spinner />
        Fetching park feature data...
      </div>
    );

  return (
    <>
      <div className="mb-4">
        <span>Found location:</span>
        <h2 className="text-2xl font-bold">
          {locationQuery.data.city}, {locationQuery.data.country}
        </h2>
        {config.showParkFeatures && parkQuery.error && (
          <div className="mt-1 text-red-500">
            Error fetching park feature data: {parkQuery.error.message}
          </div>
        )}
        {config.showWaterFeatures && waterQuery.error && (
          <div className="mt-1 text-red-500">
            Error fetching water feature data: {waterQuery.error.message}
          </div>
        )}
      </div>
      <MapCanvas
        elements={mapQuery.data}
        waterElements={config.showWaterFeatures ? (waterQuery.data ?? []) : []}
        parkElements={config.showParkFeatures ? (parkQuery.data ?? []) : []}
        bbox={bbox}
        resolution={config.resolution}
        theme={config.theme}
        displayConfig={formatPosterText(locationQuery.data, config.textConfig)}
      />
    </>
  );
}
