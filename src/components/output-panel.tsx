import { search } from "@/lib/nominatim";
import type { GenerationConfig } from "@/models/generation";
import { useQuery } from "@tanstack/react-query";

type Props = {
  config: GenerationConfig;
};

export default function OutputPanel({ config }: Props) {
  const { isPending, error, data } = useQuery({
    queryKey: ["nominatim", config.city, config.country],
    queryFn: () => search(config.city, config.country),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <div>
        You set City: {config.city}, County: {config.country}
      </div>
      <code>{JSON.stringify(data, null, "\n")}</code>
    </div>
  );
}
