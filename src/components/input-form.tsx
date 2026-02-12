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
  DEFAULT_DISTANCE,
  DISTANCE_STEP,
  MAX_DISTANCE,
  MIN_DISTANCE,
  resolutionOptions,
  resolutionValues,
  type GenerationConfig,
  type ResolutionType,
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
import { ChevronDown } from "lucide-react";

type Props = {
  onSubmit: (config: GenerationConfig) => void;
};

export default function InputForm({ onSubmit }: Props) {
  const [distance, setDistance] = useState<number | "">(DEFAULT_DISTANCE);
  return (
    <form
      className="m-4 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const resolution =
          resolutionValues[
            e.target["poster-resolution"].value as ResolutionType
          ] ?? resolutionValues["fhd"];
        onSubmit({
          city: e.target.city.value,
          country: e.target.country.value,
          showWaterFeatures: e.target["water-features-enabled"].checked,
          showParkFeatures: e.target["park-features-enabled"].checked,
          resolution,
          radiusMeters: distance || DEFAULT_DISTANCE,
        });
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="city">City</FieldLabel>
          <Input id="city" placeholder="New York" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="country">Country</FieldLabel>
          <Input id="country" placeholder="USA" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="resolution">Resolution</FieldLabel>
          <Select
            defaultValue={resolutionOptions[0].value}
            name="poster-resolution"
          >
            <SelectTrigger id="resolution">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {resolutionOptions.map(({ name, value }) => (
                <SelectItem value={value} key={value}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="map-distance">Map Radius (meters)</FieldLabel>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Slider
                min={MIN_DISTANCE}
                max={MAX_DISTANCE}
                step={DISTANCE_STEP}
                value={[distance || 0]}
                onValueChange={(v) => setDistance(v[0])}
              />
            </div>
            <div className="w-18">
              <Input
                id="map-distance"
                type="text"
                value={distance}
                onChange={(e) => {
                  if (!e.target.value) {
                    setDistance("");
                    return;
                  }
                  const val = Number(e.target.value);
                  if (Number.isNaN(val)) return;
                  const clamped = Math.min(Math.max(val, 0), MAX_DISTANCE);
                  setDistance(clamped);
                }}
                onBlur={() => {
                  if (distance === "" || distance < MIN_DISTANCE) {
                    setDistance(MIN_DISTANCE);
                  }
                }}
              />
            </div>
          </div>
          <FieldDescription>
            <Collapsible>
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
                <p></p>
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
          </FieldDescription>
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
