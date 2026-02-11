export type GenerationConfig = {
  city: string;
  country: string;
  showWaterFeatures?: boolean;
  showParkFeatures?: boolean;
};

export const CANVAS_SIZE = 2000;
export const RADIUS_METERS = 2000;

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
