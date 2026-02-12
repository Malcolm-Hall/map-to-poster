export const resolutionOptions = [
  { name: "Square (1080x1080)", value: "square" },
  { name: "Full HD (1920x1080)", value: "fhd" },
  { name: "QHD (2560x1440)", value: "qhd" },
  { name: "4K (3840x2160)", value: "4k" },
] as const;

export type ResolutionType = (typeof resolutionOptions)[number]["value"];
export type PosterResolution = { width: number; height: number };

export const resolutionValues: Record<ResolutionType, PosterResolution> = {
  fhd: { height: 1920, width: 1080 },
  qhd: { height: 2560, width: 1440 },
  "4k": { height: 3840, width: 2160 },
  square: { height: 1080, width: 1080 },
};

export type GenerationConfig = {
  city: string;
  country: string;
  resolution: PosterResolution;
  radiusMeters: number;
  showWaterFeatures?: boolean;
  showParkFeatures?: boolean;
};

export const MIN_MAP_RADIUS = 1000;
export const MAX_MAP_RADIUS = 20_000;
export const DEFAULT_MAP_RADIUS = 2000;
export const MAP_RADIUS_STEP = 100;

export const THEME = {
  background: "#151515",
  water: "#1f4e79",
  park: "#1f6f54",
  roads: {
    motorway: { color: "#ff0000", width: 2.4 }, //red
    primary: { color: "#00ff00", width: 1.6 }, //green
    secondary: { color: "#0000ff", width: 1.2 }, //blue
    tertiary: { color: "#00ffff", width: 1.0 }, //cyan
    residential: { color: "#ff00ff", width: 0.8 }, //magenta
    default: { color: "#ffff00", width: 0.6 }, //yellow
  },
  text: "#ffffff",
};

export type DisplayConfig = {
  mainHeading: string;
  subHeading: string;
  coordinates: string;
};
