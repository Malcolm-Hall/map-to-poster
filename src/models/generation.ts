export const DEFAULT_CUSTOM_RESOLUTION = 1080;
export const MAX_CUSTOM_RESOLUTION = 10_000;
export const MIN_CUSTOM_RESOLUTION = 300;

export const resolutionMap = {
  square: {
    name: "HD Square (1080x1080)",
    value: { width: 1080, height: 1080 },
  },
  fhdPortrait: {
    name: "HD Portrait (1080x1920)",
    value: { width: 1080, height: 1920 },
  },
  fhdLandscape: {
    name: "HD Landscape (1920x1080)",
    value: { height: 1080, width: 1920 },
  },
  qhdPortrait: {
    name: "QHD Portrait (1440x2560)",
    value: { width: 1440, height: 2560 },
  },
  qhdLandscape: {
    name: "QHD Landscape (2560x1440)",
    value: { height: 1440, width: 2560 },
  },
  "4kPortrait": {
    name: "4K Portrait (2160x3840)",
    value: { width: 2160, height: 3840 },
  },
  "4kLandscape": {
    name: "4K Landscape (3840x2160)",
    value: { height: 2160, width: 3840 },
  },
  custom: {
    name: "Custom",
    value: {
      width: DEFAULT_CUSTOM_RESOLUTION,
      height: DEFAULT_CUSTOM_RESOLUTION,
    },
  },
} as const;

export type ResolutionType = keyof typeof resolutionMap;
export type ResolutionOption = (typeof resolutionMap)[ResolutionType];
export type PosterResolution = { width: number; height: number };

export const resolutionOptions = Object.entries(resolutionMap).map(
  ([key, value]) => ({ key, ...value }),
) as {
  [K in ResolutionType]: { key: K } & (typeof resolutionMap)[K];
}[ResolutionType][];
export const resolutionTypes = Object.keys(resolutionMap) as ResolutionType[];

export const MIN_MAP_RADIUS = 1000;
export const MAX_MAP_RADIUS = 20_000;
export const DEFAULT_MAP_RADIUS = 2000;
export const MAP_RADIUS_STEP = 100;

export const ROAD_WIDTHS = {
  motorway: 2.4,
  primary: 1.6,
  secondary: 1.2,
  tertiary: 1.0,
  residential: 0.8,
  default: 0.6,
};

export const THEME = {
  background: "#151515",
  water: "#1f4e79",
  parks: "#1f6f54",
  roads: {
    motorway: "#ff0000", //red
    primary: "#00ff00", //green
    secondary: "#0000ff", //blue
    tertiary: "#00ffff", //cyan
    residential: "#ff00ff", //magenta
    default: "#ffff00", //yellow
  },
  text: "#ffffff",
  gradient: "#ffffff",
};

export const MIN_LATITUDE = -90;
export const MAX_LATITUDE = 90;
export const MIN_LONGITUDE = -180;
export const MAX_LONGITUDE = 180;

export type LookupType = "city" | "coordinates";

export type CityLookup = {
  type: Extract<LookupType, "city">;
  city: string;
  country: string;
};

export type CoordinateLookup = {
  type: Extract<LookupType, "coordinates">;
  latitude: number;
  longitude: number;
};

export type Lookup = CityLookup | CoordinateLookup;

export type TextConfig = {
  customCityText: string;
  customCountryText: string;
};

export type GenerationConfig = {
  lookup: Lookup;
  resolution: PosterResolution;
  radiusMeters: number;
  showWaterFeatures?: boolean;
  showParkFeatures?: boolean;
  textConfig: TextConfig;
};

export type DisplayConfig = {
  mainHeading: string;
  subHeading: string;
  coordinates: string;
};
