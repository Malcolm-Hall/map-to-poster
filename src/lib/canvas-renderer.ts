import { CANVAS_SIZE, THEME, type DisplayConfig } from "@/models/generation";
import type { GeometryElement } from "@/models/osm";
import type { OverpassBbox } from "overpass-ts";

function projectCoordinate(
  lat: number,
  lon: number,
  bbox: OverpassBbox,
): { x: number; y: number } {
  const x = ((lon - bbox.minlon) / (bbox.maxlon - bbox.minlon)) * CANVAS_SIZE;
  const y =
    CANVAS_SIZE -
    ((lat - bbox.minlat) / (bbox.maxlat - bbox.minlat)) * CANVAS_SIZE;
  return { x, y };
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  geometry: Array<{ lat: number; lon: number }>,
  bbox: OverpassBbox,
): void {
  ctx.beginPath();
  geometry.forEach((p, i) => {
    const { x, y } = projectCoordinate(p.lat, p.lon, bbox);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  geometry: Array<{ lat: number; lon: number }>,
  bbox: OverpassBbox,
): void {
  ctx.beginPath();
  geometry.forEach((p, i) => {
    const { x, y } = projectCoordinate(p.lat, p.lon, bbox);
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
  options: DisplayConfig,
): void {
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.fillStyle = THEME.background;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  for (const el of waterElements) {
    const type = el.tags?.natural || el.tags?.waterway;
    if (!type || !el.geometry) continue;

    ctx.fillStyle = THEME.water;
    drawPolygon(ctx, el.geometry, bbox);
  }

  for (const el of parkElements) {
    const type = el.tags?.leisure || el.tags?.landuse;
    if (!type || !el.geometry) continue;

    ctx.fillStyle = THEME.park;
    drawPolygon(ctx, el.geometry, bbox);
  }

  for (const el of elements) {
    const type = el.tags?.highway;
    if (!type || !el.geometry) continue;

    const style = getRoadStyle(type);

    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    drawPath(ctx, el.geometry, bbox);
  }

  // Text overlay
  ctx.fillStyle = THEME.text;
  ctx.textAlign = "center";
  ctx.font = "bold 64px sans-serif";
  ctx.fillText(options.mainHeading, CANVAS_SIZE / 2, CANVAS_SIZE - 120);

  ctx.font = "32px sans-serif";
  ctx.fillText(options.subHeading, CANVAS_SIZE / 2, CANVAS_SIZE - 70);

  ctx.font = "24px sans-serif";
  ctx.fillText(options.coordinates, CANVAS_SIZE / 2, CANVAS_SIZE - 30);
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

function getRoadStyle(type: string) {
  switch (type) {
    case "motorway_link":
    case "motorway":
      return THEME["roads"].motorway;
    case "primary":
    case "primary_link":
    case "trunk":
    case "trunk_link":
      return THEME.roads.primary;
    case "secondary":
    case "secondary_link":
      return THEME.roads.secondary;
    case "tertiary":
    case "tertiary_link":
      return THEME.roads.tertiary;
    case "residential":
    case "living_street":
      return THEME.roads.residential;
    case "unclassified":
    default:
      return THEME.roads.default;
  }
}
