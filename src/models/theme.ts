export type ThemeConfig = {
  name: string;
  background: string;
  text: string;
  gradient: string;
  water: string;
  parks: string;
  roads: {
    motorway: string;
    primary: string;
    secondary: string;
    tertiary: string;
    residential: string;
    default: string;
  };
};

export const BUILTIN_THEME_MAP = {
  autumn: {
    name: "Autumn",
    background: "#FBF7F0",
    text: "#8B4513",
    gradient: "#FBF7F0",
    water: "#D8CFC0",
    parks: "#E8E0D0",
    roads: {
      motorway: "#8B2500",
      primary: "#B8450A",
      secondary: "#CC7A30",
      tertiary: "#D9A050",
      residential: "#E8C888",
      default: "#CC7A30",
    },
  },
  blueprint: {
    name: "Blueprint",
    background: "#1A3A5C",
    text: "#E8F4FF",
    gradient: "#1A3A5C",
    water: "#0F2840",
    parks: "#1E4570",
    roads: {
      motorway: "#E8F4FF",
      primary: "#C5DCF0",
      secondary: "#9FC5E8",
      tertiary: "#7BAED4",
      residential: "#5A96C0",
      default: "#7BAED4",
    },
  },
  contrastZones: {
    name: "Contrast Zones",
    background: "#FFFFFF",
    text: "#000000",
    gradient: "#FFFFFF",
    water: "#B0B0B0",
    parks: "#ECECEC",
    roads: {
      motorway: "#000000",
      primary: "#0F0F0F",
      secondary: "#252525",
      tertiary: "#404040",
      residential: "#5A5A5A",
      default: "#404040",
    },
  },
  copperPatina: {
    name: "Copper Patina",
    background: "#E8F0F0",
    text: "#2A5A5A",
    gradient: "#E8F0F0",
    water: "#C0D8D8",
    parks: "#D8E8E0",
    roads: {
      motorway: "#B87333",
      primary: "#5A8A8A",
      secondary: "#6B9E9E",
      tertiary: "#88B4B4",
      residential: "#A8CCCC",
      default: "#88B4B4",
    },
  },
  emerald: {
    name: "Emerald City",
    background: "#062C22",
    text: "#E3F9F1",
    gradient: "#062C22",
    water: "#0D4536",
    parks: "#0F523E",
    roads: {
      motorway: "#4ADEB0",
      primary: "#2DB88F",
      secondary: "#249673",
      tertiary: "#1B7559",
      residential: "#155C46",
      default: "#155C46",
    },
  },
  forest: {
    name: "Forest",
    background: "#F0F4F0",
    text: "#2D4A3E",
    gradient: "#F0F4F0",
    water: "#B8D4D4",
    parks: "#D4E8D4",
    roads: {
      motorway: "#2D4A3E",
      primary: "#3D6B55",
      secondary: "#5A8A70",
      tertiary: "#7AAA90",
      residential: "#A0C8B0",
      default: "#7AAA90",
    },
  },
  gradientRoads: {
    name: "Gradient Roads",
    background: "#FFFFFF",
    text: "#000000",
    gradient: "#FFFFFF",
    water: "#D5D5D5",
    parks: "#EFEFEF",
    roads: {
      motorway: "#050505",
      primary: "#151515",
      secondary: "#2A2A2A",
      tertiary: "#404040",
      residential: "#555555",
      default: "#404040",
    },
  },
  japaneseInk: {
    name: "Japanese Ink",
    background: "#FAF8F5",
    text: "#2C2C2C",
    gradient: "#FAF8F5",
    water: "#E8E4E0",
    parks: "#F0EDE8",
    roads: {
      motorway: "#8B2500",
      primary: "#4A4A4A",
      secondary: "#6A6A6A",
      tertiary: "#909090",
      residential: "#B8B8B8",
      default: "#909090",
    },
  },
  midnightBlue: {
    name: "Midnight Blue",
    background: "#0A1628",
    text: "#D4AF37",
    gradient: "#0A1628",
    water: "#061020",
    parks: "#0F2235",
    roads: {
      motorway: "#D4AF37",
      primary: "#C9A227",
      secondary: "#A8893A",
      tertiary: "#8B7355",
      residential: "#6B5B4F",
      default: "#8B7355",
    },
  },
  monochromeBlue: {
    name: "Monochrome Blue",
    background: "#F5F8FA",
    text: "#1A3A5C",
    gradient: "#F5F8FA",
    water: "#D0E0F0",
    parks: "#E0EAF2",
    roads: {
      motorway: "#1A3A5C",
      primary: "#2A5580",
      secondary: "#4A7AA8",
      tertiary: "#7AA0C8",
      residential: "#A8C4E0",
      default: "#4A7AA8",
    },
  },
  neonCyberpunk: {
    name: "Neon Cyberpunk",
    background: "#0D0D1A",
    text: "#00FFFF",
    gradient: "#0D0D1A",
    water: "#0A0A15",
    parks: "#151525",
    roads: {
      motorway: "#FF00FF",
      primary: "#00FFFF",
      secondary: "#00C8C8",
      tertiary: "#0098A0",
      residential: "#006870",
      default: "#0098A0",
    },
  },
  noir: {
    name: "Noir",
    background: "#000000",
    text: "#FFFFFF",
    gradient: "#000000",
    water: "#0A0A0A",
    parks: "#111111",
    roads: {
      motorway: "#FFFFFF",
      primary: "#E0E0E0",
      secondary: "#B0B0B0",
      tertiary: "#808080",
      residential: "#505050",
      default: "#808080",
    },
  },
  ocean: {
    name: "Ocean",
    background: "#F0F8FA",
    text: "#1A5F7A",
    gradient: "#F0F8FA",
    water: "#B8D8E8",
    parks: "#D8EAE8",
    roads: {
      motorway: "#1A5F7A",
      primary: "#2A7A9A",
      secondary: "#4A9AB8",
      tertiary: "#70B8D0",
      residential: "#A0D0E0",
      default: "#4A9AB8",
    },
  },
  pastelDream: {
    name: "Pastel Dream",
    background: "#FAF7F2",
    text: "#5D5A6D",
    gradient: "#FAF7F2",
    water: "#D4E4ED",
    parks: "#E8EDE4",
    roads: {
      motorway: "#7B8794",
      primary: "#9BA4B0",
      secondary: "#B5AEBB",
      tertiary: "#C9C0C9",
      residential: "#D8D2D8",
      default: "#C9C0C9",
    },
  },
  sunset: {
    name: "Sunset",
    background: "#FDF5F0",
    text: "#C45C3E",
    gradient: "#FDF5F0",
    water: "#F0D8D0",
    parks: "#F8E8E0",
    roads: {
      motorway: "#C45C3E",
      primary: "#D87A5A",
      secondary: "#E8A088",
      tertiary: "#F0B8A8",
      residential: "#F5D0C8",
      default: "#E8A088",
    },
  },
  terracotta: {
    name: "Terracotta",
    background: "#F5EDE4",
    text: "#8B4513",
    gradient: "#F5EDE4",
    water: "#A8C4C4",
    parks: "#E8E0D0",
    roads: {
      motorway: "#A0522D",
      primary: "#B8653A",
      secondary: "#C9846A",
      tertiary: "#D9A08A",
      residential: "#E5C4B0",
      default: "#D9A08A",
    },
  },
  warmBeige: {
    name: "Warm Beige",
    background: "#F5F0E8",
    text: "#6B5B4F",
    gradient: "#F5F0E8",
    water: "#DDD5C8",
    parks: "#E8E4D8",
    roads: {
      motorway: "#8B7355",
      primary: "#A08B70",
      secondary: "#B5A48E",
      tertiary: "#C9BBAA",
      residential: "#D9CFC2",
      default: "#C9BBAA",
    },
  },
  debug: {
    name: "Debug",
    background: "#151515",
    text: "#ffffff",
    gradient: "#ffffff",
    parks: "#1f6f54",
    water: "#1f4e79",
    roads: {
      motorway: "#ff0000",
      primary: "#00ff00",
      secondary: "#0000ff",
      tertiary: "#00ffff",
      residential: "#ff00ff",
      default: "#ffff00",
    },
  },
} satisfies Record<string, ThemeConfig>;

export type ThemeType = keyof typeof BUILTIN_THEME_MAP;

export const BUILTIN_THEME_OPTIONS = Object.entries(BUILTIN_THEME_MAP).map(
  ([key, value]) => ({ key, ...value }),
) as {
  [K in ThemeType]: { key: K } & (typeof BUILTIN_THEME_MAP)[K];
}[ThemeType][];
export const BUILTIN_THEME_TYPES = Object.keys(BUILTIN_THEME_MAP);
