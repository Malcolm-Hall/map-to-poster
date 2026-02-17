import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { Check, XIcon } from "lucide-react";

export function IndicatorLoading(props: { title: string }) {
  return (
    <Item className="mb-2 p-2" variant="outline">
      <ItemMedia>
        <Spinner className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{props.title}</ItemTitle>
      </ItemContent>
    </Item>
  );
}

export function IndicatorSuccess(props: { title: string }) {
  return (
    <Item className="mb-2 p-2 text-green-500" variant="outline">
      <ItemMedia>
        <Check className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{props.title}</ItemTitle>
      </ItemContent>
    </Item>
  );
}

export function IndicatorError(props: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <Item className="mb-2 p-2 text-red-500" variant="outline">
      <ItemMedia>
        <XIcon className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          <span>
            {props.title}, please{" "}
            <a
              className="underline hover:cursor-pointer"
              onClick={() => props.onRetry()}
            >
              try again
            </a>
          </span>
        </ItemTitle>
        <ItemDescription>{props.message}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
