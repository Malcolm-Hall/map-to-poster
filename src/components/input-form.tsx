import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_MAP_RADIUS,
  MAP_RADIUS_STEP,
  MAX_MAP_RADIUS,
  MIN_MAP_RADIUS,
  resolutionOptions,
  resolutionMap,
  type GenerationConfig,
  type ResolutionType,
  DEFAULT_CUSTOM_RESOLUTION,
  MAX_CUSTOM_RESOLUTION,
  MIN_CUSTOM_RESOLUTION,
} from "@/models/generation";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, XIcon } from "lucide-react";

type NumberInput = number | "";

type Props = {
  onSubmit: (config: GenerationConfig) => void;
};

export default function InputForm({ onSubmit }: Props) {
  const [mapRadius, setMapRadius] = useState<NumberInput>(DEFAULT_MAP_RADIUS);
  const [resolutionType, setResolutionType] = useState<ResolutionType>(
    resolutionOptions[0].key,
  );
  const [customWidth, setCustomWidth] = useState<NumberInput>(
    DEFAULT_CUSTOM_RESOLUTION,
  );
  const [customHeight, setCustomHeight] = useState<NumberInput>(
    DEFAULT_CUSTOM_RESOLUTION,
  );

  return (
    <form
      className="m-4 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          city: e.target.city.value,
          country: e.target.country.value,
          showWaterFeatures: e.target["water-features-enabled"].checked,
          showParkFeatures: e.target["park-features-enabled"].checked,
          resolution:
            resolutionType === "custom"
              ? {
                  width: customWidth || DEFAULT_CUSTOM_RESOLUTION,
                  height: customHeight || DEFAULT_CUSTOM_RESOLUTION,
                }
              : resolutionMap[resolutionType].value,
          radiusMeters: mapRadius || DEFAULT_MAP_RADIUS,
        });
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input id="city" type="text" placeholder="New York" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="country">Country</FieldLabel>
          <Input id="country" type="text" placeholder="USA" required />
        </Field>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="resolution">Resolution</FieldLabel>
            <Select
              value={resolutionType}
              onValueChange={(key: ResolutionType) => setResolutionType(key)}
              name="poster-resolution"
            >
              <SelectTrigger id="resolution">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resolutionOptions.map(({ name, key }) => (
                  <SelectItem value={key} key={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {resolutionType === "custom" && (
            <div className="grid grid-cols-[1fr_16px_1fr]">
              <Field>
                <FieldLabel htmlFor="resolution-width">Width</FieldLabel>
                <Input
                  id="resolution-width"
                  type="text"
                  value={customWidth}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setCustomWidth("");
                      return;
                    }
                    const val = Number(e.target.value);
                    if (Number.isNaN(val)) return;
                    const clamped = Math.min(
                      Math.max(val, 0),
                      MAX_CUSTOM_RESOLUTION,
                    );
                    setCustomWidth(clamped);
                  }}
                  onBlur={() => {
                    if (
                      customWidth === "" ||
                      customWidth < MIN_CUSTOM_RESOLUTION
                    ) {
                      setCustomWidth(MIN_CUSTOM_RESOLUTION);
                    }
                  }}
                />
              </Field>
              <XIcon size={16} className="mt-10.5" />
              <Field>
                <FieldLabel htmlFor="resolution-height">Height</FieldLabel>
                <Input
                  id="resolution-height"
                  type="text"
                  value={customHeight}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setCustomHeight("");
                      return;
                    }
                    const val = Number(e.target.value);
                    if (Number.isNaN(val)) return;
                    const clamped = Math.min(
                      Math.max(val, 0),
                      MAX_CUSTOM_RESOLUTION,
                    );
                    setCustomHeight(clamped);
                  }}
                  onBlur={() => {
                    if (
                      customHeight === "" ||
                      customHeight < MIN_CUSTOM_RESOLUTION
                    ) {
                      setCustomHeight(MIN_CUSTOM_RESOLUTION);
                    }
                  }}
                />
              </Field>
            </div>
          )}
        </FieldGroup>
        <Field>
          <FieldLabel htmlFor="map-distance">Map Radius (meters)</FieldLabel>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Slider
                min={MIN_MAP_RADIUS}
                max={MAX_MAP_RADIUS}
                step={MAP_RADIUS_STEP}
                value={[mapRadius || 0]}
                onValueChange={(v) => setMapRadius(v[0])}
              />
            </div>
            <div className="w-20">
              <Input
                id="map-distance"
                type="text"
                value={mapRadius}
                onChange={(e) => {
                  if (!e.target.value) {
                    setMapRadius("");
                    return;
                  }
                  const val = Number(e.target.value);
                  if (Number.isNaN(val)) return;
                  const clamped = Math.min(Math.max(val, 0), MAX_MAP_RADIUS);
                  setMapRadius(clamped);
                }}
                onBlur={() => {
                  if (mapRadius === "" || mapRadius < MIN_MAP_RADIUS) {
                    setMapRadius(MIN_MAP_RADIUS);
                  }
                }}
              />
            </div>
          </div>
          <Collapsible className="text-muted-foreground text-sm">
            <CollapsibleTrigger asChild>
              <span className="group hover:cursor-pointer">
                Radius Guide
                <ChevronDown
                  size={16}
                  className="mb-1 ml-1 inline-block group-data-[state=open]:rotate-180"
                />
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Radius (m)</TableHead>
                    <TableHead>Best For</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>4000-6000</TableCell>
                    <TableCell>Small/dense cities</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>8000-12000</TableCell>
                    <TableCell>Medium cities, focused downtown</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>15000-20000</TableCell>
                    <TableCell>Large metros, full city view*</TableCell>
                  </TableRow>
                </TableBody>
                <TableCaption className="pl-2 text-left">
                  * Larger maps take longer to generate
                </TableCaption>
              </Table>
            </CollapsibleContent>
          </Collapsible>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="park-features" name="park-features-enabled" />
          <FieldLabel htmlFor="park-features">Enable Park Features</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="water-features" name="water-features-enabled" />
          <FieldContent>
            <FieldLabel htmlFor="water-features">
              Enable Water Features
            </FieldLabel>
            <FieldDescription>Experimental</FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <Button type="submit">Generate</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
