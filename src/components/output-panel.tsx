import { type GenerationConfig } from "@/models/generation";
import useLocationQuery from "@/hooks/useLocationQuery";
import MapRenderer from "./map-renderer";
import {
  IndicatorError,
  IndicatorLoading,
  IndicatorSuccess,
} from "./indicator";

type Props = {
  config: GenerationConfig;
};

export default function OutputPanel({ config }: Props) {
  const locationQuery = useLocationQuery(config.lookup);

  if (locationQuery.isPending || locationQuery.isFetching)
    return <IndicatorLoading title="Finding location" />;

  if (locationQuery.error)
    return (
      <IndicatorError
        title="Failed to find location"
        message={locationQuery.error.message}
        onRetry={locationQuery.refetch}
      />
    );

  return (
    <>
      <IndicatorSuccess
        title={`Found Location: ${locationQuery.data.city}, ${locationQuery.data.country}`}
      />
      <MapRenderer config={config} locationData={locationQuery.data} />
    </>
  );
}
