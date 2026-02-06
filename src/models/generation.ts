export type GenerationConfig = {
  city: string;
  country: string;
};

export const CANVAS_SIZE = 2000;
export const RADIUS_METERS = 2000;

export const THEME = {
  background: "#0e0e11",
  water: "#1f4e79",
  park: "#1f6f54",
  roads: {
    motorway: { color: "#ffffff", width: 2.4 },
    primary: { color: "#d9d9d9", width: 1.6 },
    secondary: { color: "#bdbdbd", width: 1.2 },
    residential: { color: "#9e9e9e", width: 0.8 },
    default: { color: "#7d7d7d", width: 0.6 },
  },
  text: "#ffffff",
};

export type DisplayConfig = {
  mainHeading: string;
  subHeading: string;
  coordinates: string;
};
