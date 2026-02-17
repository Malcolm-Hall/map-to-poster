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
import type { Location } from "@/hooks/useLocationQuery";
import { formatPosterText } from "@/lib/utils";
import {
  IndicatorError,
  IndicatorLoading,
  IndicatorSuccess,
} from "./indicator";

type Props = {
  config: GenerationConfig;
  locationData: Location;
};

export default function MapRenderer({ locationData, config }: Props) {
  const bbox = bboxFromPoint(
    locationData,
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
    enabled: !!mapQuery.data && !!config.showWaterFeatures,
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
    enabled: !!mapQuery.data && !!config.showParkFeatures,
  });

  if (mapQuery.isPending)
    return <IndicatorLoading title="Downloading map data" />;

  if (mapQuery.error)
    return (
      <IndicatorError
        title="Failed to download map data"
        message={mapQuery.error.message}
        onRetry={mapQuery.refetch}
      />
    );

  const indicators = [<IndicatorSuccess title="Map data downloaded" />];

  if (config.showParkFeatures) {
    if (parkQuery.isPending) {
      indicators.push(
        <IndicatorLoading title="Downloading parks layer data" />,
      );
    } else if (parkQuery.error) {
      indicators.push(
        <IndicatorError
          title="Failed to download parks layer data"
          message={parkQuery.error.message}
          onRetry={parkQuery.refetch}
        />,
      );
    } else {
      indicators.push(<IndicatorSuccess title="Parks layer data downloaded" />);
    }
  }

  if (config.showWaterFeatures) {
    if (waterQuery.isPending) {
      indicators.push(
        <IndicatorLoading title="Downloading water layer data" />,
      );
    } else if (waterQuery.error) {
      indicators.push(
        <IndicatorError
          title="Failed to download water layer data"
          message={waterQuery.error.message}
          onRetry={waterQuery.refetch}
        />,
      );
    } else {
      indicators.push(<IndicatorSuccess title="Water layer data downloaded" />);
    }
  }

  if (
    (config.showWaterFeatures && waterQuery.isPending) ||
    (config.showParkFeatures && parkQuery.isPending)
  )
    return <>{...indicators}</>;

  return (
    <>
      {...indicators}
      <MapCanvas
        elements={mapQuery.data}
        waterElements={config.showWaterFeatures ? (waterQuery.data ?? []) : []}
        parkElements={config.showParkFeatures ? (parkQuery.data ?? []) : []}
        location={locationData}
        bbox={bbox}
        resolution={config.resolution}
        theme={config.theme}
        displayConfig={formatPosterText(locationData, config.textConfig)}
      />
    </>
  );
}
