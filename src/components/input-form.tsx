import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
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
  resolutionTypes,
  MIN_LATITUDE,
  MAX_LATITUDE,
  MIN_LONGITUDE,
  MAX_LONGITUDE,
  type LookupType,
  type Lookup,
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
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const baseSchema = z.object({
  resolutionType: z.literal(resolutionTypes),
  customWidth: z.coerce
    .number<string>({
      error: (issue) => {
        if (issue.code === "invalid_type") {
          return "A valid width is required";
        }
      },
    })
    .int()
    .min(MIN_CUSTOM_RESOLUTION, {
      message: `Width must be at least ${MIN_CUSTOM_RESOLUTION}`,
    })
    .max(MAX_CUSTOM_RESOLUTION, {
      message: `Width must be at most ${MAX_CUSTOM_RESOLUTION}`,
    }),
  customHeight: z.coerce
    .number<string>({
      error: (issue) => {
        if (issue.code === "invalid_type") {
          return "A valid height is required";
        }
      },
    })
    .int()
    .min(MIN_CUSTOM_RESOLUTION, {
      message: `Height must be at least ${MIN_CUSTOM_RESOLUTION}`,
    })
    .max(MAX_CUSTOM_RESOLUTION, {
      message: `Height must be at most ${MAX_CUSTOM_RESOLUTION}`,
    }),
  mapRadius: z.coerce
    .number<string>({
      error: (issue) => {
        if (issue.code === "invalid_type") {
          return "A valid radius is required";
        }
      },
    })
    .min(MIN_MAP_RADIUS, {
      message: `Radius must be at least ${MIN_MAP_RADIUS} meters`,
    })
    .max(MAX_MAP_RADIUS, {
      message: `Radius must be at most ${MAX_MAP_RADIUS} meters`,
    }),
  showWaterFeatures: z.boolean(),
  showParkFeatures: z.boolean(),
  customCityText: z.string(),
  customCountryText: z.string(),
});

const citySchema = baseSchema.extend({
  lookupType: z.literal("city"),
  city: z.string().trim().min(1, { message: "City is required" }),
  country: z.string().trim().min(1, { message: "Country is required" }),
  latitude: z.coerce.number<string>(),
  longitude: z.coerce.number<string>(),
});

const coordinateSchema = baseSchema.extend({
  lookupType: z.literal("coordinates"),
  city: z.string(),
  country: z.string(),
  latitude: z.coerce
    .number<string>({
      error: (issue) => {
        if (issue.code === "invalid_type") {
          return "A valid latitude is required";
        }
      },
    })
    .min(MIN_LATITUDE, {
      message: `Latitude must be at least ${MIN_LATITUDE}`,
    })
    .max(MAX_LATITUDE, {
      message: `Latitude must be at most ${MAX_LATITUDE}`,
    }),
  longitude: z.coerce
    .number<string>({
      error: (issue) => {
        if (issue.code === "invalid_type") {
          return "A valid longitude is required";
        }
      },
    })
    .min(MIN_LONGITUDE, {
      message: `Longitude must be at least ${MIN_LONGITUDE}`,
    })
    .max(MAX_LONGITUDE, {
      message: `Longitude must be at most ${MAX_LONGITUDE}`,
    }),
});

const formSchema = z.discriminatedUnion("lookupType", [
  citySchema,
  coordinateSchema,
]);

type Props = {
  onSubmit: (config: GenerationConfig) => void;
};

export default function InputForm(props: Props) {
  const form = useForm({
    defaultValues: {
      lookupType: "city" as LookupType,
      city: "",
      country: "",
      latitude: "",
      longitude: "",
      resolutionType: resolutionOptions[0].key,
      customWidth: DEFAULT_CUSTOM_RESOLUTION.toString(),
      customHeight: DEFAULT_CUSTOM_RESOLUTION.toString(),
      mapRadius: DEFAULT_MAP_RADIUS.toString(),
      showWaterFeatures: false,
      showParkFeatures: false,
      customCityText: "",
      customCountryText: "",
    },
    validators: {
      onSubmit: formSchema,
      onBlur: formSchema,
    },
    onSubmit: (data) => {
      const value = formSchema.parse(data.value);
      const resolution =
        value.resolutionType === "custom"
          ? {
              width: Number(value.customWidth),
              height: Number(value.customHeight),
            }
          : resolutionMap[value.resolutionType].value;

      let lookup: Lookup;
      if (value.lookupType === "city") {
        lookup = {
          type: value.lookupType,
          city: value.city,
          country: value.country,
        };
      } else {
        lookup = {
          type: value.lookupType,
          longitude: Number(value.longitude),
          latitude: Number(value.latitude),
        };
      }

      props.onSubmit({
        lookup,
        showWaterFeatures: value.showWaterFeatures,
        showParkFeatures: value.showParkFeatures,
        resolution,
        radiusMeters: Number(value.mapRadius),
        textConfig: {
          customCityText: value.customCityText,
          customCountryText: value.customCountryText,
        },
      });
    },
  });

  return (
    <form
      className="m-4 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="lookupType"
          children={(field) => (
            <Tabs
              value={field.state.value}
              onValueChange={(value) => field.handleChange(value as LookupType)}
            >
              <TabsList variant="line">
                <TabsTrigger value="city">Location</TabsTrigger>
                <TabsTrigger value="coordinates">Coordinates</TabsTrigger>
              </TabsList>
              <TabsContent value="city">
                <FieldGroup>
                  <form.Field
                    name="city"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>City</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="New York"
                            type="text"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                  <form.Field
                    name="country"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="United States"
                            type="text"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </FieldGroup>
              </TabsContent>
              <TabsContent value="coordinates">
                <FieldGroup>
                  <form.Field
                    name="latitude"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Latitude</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            type="text"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                  <form.Field
                    name="longitude"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Longitude
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            type="text"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </FieldGroup>
              </TabsContent>
            </Tabs>
          )}
        />

        <form.Field
          name="resolutionType"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldGroup>
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Poster Resolution
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(value: ResolutionType) =>
                      field.handleChange(value)
                    }
                  >
                    <SelectTrigger
                      id="resolution-select"
                      aria-invalid={isInvalid}
                    >
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
                {field.state.value === "custom" && (
                  <div className="grid grid-cols-[1fr_16px_1fr]">
                    <form.Field
                      name="customWidth"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Width</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              type="text"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                    <XIcon size={16} className="mt-10.5" />
                    <form.Field
                      name="customHeight"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Height</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              type="text"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                  </div>
                )}
              </FieldGroup>
            );
          }}
        />

        <form.Field
          name="mapRadius"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const valueNumeric = Number(field.state.value);
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Map Radius (meters)
                </FieldLabel>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Slider
                      min={MIN_MAP_RADIUS}
                      max={MAX_MAP_RADIUS}
                      step={MAP_RADIUS_STEP}
                      value={[Number.isNaN(valueNumeric) ? 0 : valueNumeric]}
                      onValueChange={(v) => field.handleChange(v[0].toString())}
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="text"
                    />
                  </div>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
            );
          }}
        />

        <form.Field
          name="showParkFeatures"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <Checkbox
                  id={field.name}
                  name={field.name}
                  aria-invalid={isInvalid}
                  checked={field.state.value}
                  onCheckedChange={(v) => field.handleChange(v as boolean)}
                />
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    Enable Park Features
                  </FieldLabel>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
              </Field>
            );
          }}
        />
        <form.Field
          name="showWaterFeatures"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <Checkbox
                  id={field.name}
                  name={field.name}
                  aria-invalid={isInvalid}
                  checked={field.state.value}
                  onCheckedChange={(v) => field.handleChange(v as boolean)}
                />
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    Enable Water Features
                  </FieldLabel>
                  <FieldDescription>Experimental</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
              </Field>
            );
          }}
        />

        <Collapsible>
          <CollapsibleTrigger asChild>
            <span className="group hover:cursor-pointer">
              Advanced Options
              <ChevronDown
                size={16}
                className="mb-1 ml-1 inline-block group-data-[state=open]:rotate-180"
              />
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <FieldGroup>
              <form.Field
                name="customCityText"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Custom City Text
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="NYC"
                        type="text"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="customCountryText"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Custom Country Text
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="USA"
                        type="text"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </CollapsibleContent>
        </Collapsible>

        <Field orientation="horizontal">
          <Button type="submit">Generate</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
