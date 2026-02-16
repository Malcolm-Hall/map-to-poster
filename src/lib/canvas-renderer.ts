import {
  ROAD_WIDTHS,
  type DisplayConfig,
  type PosterResolution,
} from "@/models/generation";
import type { GeometryElement } from "@/models/osm";
import type { ThemeConfig } from "@/models/theme";
import type { OverpassBbox } from "overpass-ts";

function projectCoordinate(
  lat: number,
  lon: number,
  bbox: OverpassBbox,
  resolution: PosterResolution,
): { x: number; y: number } {
  const x =
    ((lon - bbox.minlon) / (bbox.maxlon - bbox.minlon)) * resolution.width;
  const y =
    resolution.height -
    ((lat - bbox.minlat) / (bbox.maxlat - bbox.minlat)) * resolution.height;
  return { x, y };
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  geometry: Array<{ lat: number; lon: number }>,
  bbox: OverpassBbox,
  resolution: PosterResolution,
): void {
  ctx.beginPath();
  geometry.forEach((p, i) => {
    const { x, y } = projectCoordinate(p.lat, p.lon, bbox, resolution);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  geometry: Array<{ lat: number; lon: number }>,
  bbox: OverpassBbox,
  resolution: PosterResolution,
): void {
  ctx.beginPath();
  geometry.forEach((p, i) => {
    const { x, y } = projectCoordinate(p.lat, p.lon, bbox, resolution);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
}

export function renderMapPoster(
  canvas: HTMLCanvasElement,
  elements: GeometryElement[],
  waterElements: GeometryElement[],
  parkElements: GeometryElement[],
  bbox: OverpassBbox,
  resolution: PosterResolution,
  theme: ThemeConfig,
  options: DisplayConfig,
): void {
  canvas.width = resolution.width;
  canvas.height = resolution.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, resolution.width, resolution.height);

  // Draw water
  for (const el of waterElements) {
    const type = el.tags?.natural || el.tags?.waterway;
    if (!type || !el.geometry) continue;

    ctx.fillStyle = theme.water;
    drawPolygon(ctx, el.geometry, bbox, resolution);
  }

  // Draw parks
  for (const el of parkElements) {
    const type = el.tags?.leisure || el.tags?.landuse;
    if (!type || !el.geometry) continue;

    ctx.fillStyle = theme.parks;
    drawPolygon(ctx, el.geometry, bbox, resolution);
  }

  // Draw roads
  for (const el of elements) {
    const type = el.tags?.highway;
    if (!type || !el.geometry) continue;

    const style = getRoadStyle(type, theme);

    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    drawPath(ctx, el.geometry, bbox, resolution);
  }

  // Gradient overlay
  const gradientSize = Math.floor(resolution.height / 4);

  const topGrad = ctx.createLinearGradient(0, 0, 0, gradientSize);
  topGrad.addColorStop(0, theme.gradient);
  topGrad.addColorStop(1, `${theme.gradient}00`);
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, resolution.width, gradientSize);

  const bottomGrad = ctx.createLinearGradient(
    0,
    resolution.height,
    0,
    resolution.height - gradientSize,
  );
  bottomGrad.addColorStop(0, theme.gradient);
  bottomGrad.addColorStop(1, `${theme.gradient}00`);
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(
    0,
    resolution.height - gradientSize,
    resolution.width,
    gradientSize,
  );

  const mainFontSize = 80;
  const subFontSize = 36;
  const coordFontSize = 20;
  const attributionFontSize = 10;
  const font = "sans-serif";
  const textGap = 20;
  const textStartY = (resolution.height * 5) / 6;
  let textY = textStartY;

  // Text overlay
  ctx.fillStyle = theme.text;
  ctx.textAlign = "center";
  ctx.font = `bold ${mainFontSize}px ${font}`;
  ctx.fillText(options.mainHeading, resolution.width / 2, textY);

  textY += textGap;

  // Gap for divider

  textY += textGap - 10 + subFontSize;

  ctx.font = `${subFontSize}px ${font}`;
  ctx.fillText(options.subHeading, resolution.width / 2, textY);

  textY += textGap + coordFontSize;

  ctx.font = `${coordFontSize}px ${font}`;
  const coordTextMetrics = ctx.measureText(options.coordinates);
  ctx.fillText(options.coordinates, resolution.width / 2, textY);

  // Divider
  const dividerLength = coordTextMetrics.width * 1.15;
  ctx.strokeStyle = theme.text;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo((resolution.width - dividerLength) / 2, textStartY + textGap);
  ctx.lineTo((resolution.width + dividerLength) / 2, textStartY + textGap);
  ctx.stroke();

  // Attribution
  const attributionText = "Map data from OpenStreetMap";
  ctx.font = `${attributionFontSize}px ${font}`;
  const attrTextMetrics = ctx.measureText(attributionText);
  ctx.fillText(
    attributionText,
    resolution.width - attributionFontSize - attrTextMetrics.width / 2,
    resolution.height - attributionFontSize,
  );
}

export function exportCanvasAsPNG(
  canvas: HTMLCanvasElement,
  filename: string,
): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function getRoadStyle(type: string, theme: ThemeConfig) {
  switch (type) {
    case "motorway_link":
    case "motorway":
      return { color: theme.roads.motorway, width: ROAD_WIDTHS.motorway };
    case "primary":
    case "primary_link":
    case "trunk":
    case "trunk_link":
      return { color: theme.roads.primary, width: ROAD_WIDTHS.primary };
    case "secondary":
    case "secondary_link":
      return { color: theme.roads.secondary, width: ROAD_WIDTHS.secondary };
    case "tertiary":
    case "tertiary_link":
      return { color: theme.roads.tertiary, width: ROAD_WIDTHS.tertiary };
    case "residential":
    case "living_street":
      return { color: theme.roads.residential, width: ROAD_WIDTHS.residential };
    case "unclassified":
    default:
      return { color: theme.roads.default, width: ROAD_WIDTHS.default };
  }
}
