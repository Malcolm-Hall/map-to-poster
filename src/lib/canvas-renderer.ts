import { CANVAS_SIZE, THEME, type DisplayConfig } from "@/models/generation";
import type { Bounds, GeometryElement } from "@/models/osm";

function projectCoordinate(
  lat: number,
  lon: number,
  bounds: Bounds,
): { x: number; y: number } {
  const x =
    ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * CANVAS_SIZE;
  const y =
    CANVAS_SIZE -
    ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * CANVAS_SIZE;
  return { x, y };
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  geometry: Array<{ lat: number; lon: number }>,
  bounds: Bounds,
): void {
  ctx.beginPath();
  geometry.forEach((p, i) => {
    const { x, y } = projectCoordinate(p.lat, p.lon, bounds);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  geometry: Array<{ lat: number; lon: number }>,
  bounds: Bounds,
): void {
  ctx.beginPath();
  geometry.forEach((p, i) => {
    const { x, y } = projectCoordinate(p.lat, p.lon, bounds);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
}

export function renderMapPoster(
  canvas: HTMLCanvasElement,
  elements: GeometryElement[],
  bounds: Bounds,
  options: DisplayConfig,
): void {
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.fillStyle = THEME.background;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  for (const el of elements) {
    const type = el.tags?.highway;
    if (!type) continue;

    const style =
      THEME.roads[type as keyof typeof THEME.roads] || THEME.roads.default;

    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    drawPath(ctx, el.geometry!, bounds);
  }

  // Text overlay
  ctx.fillStyle = THEME.text;
  ctx.textAlign = "center";
  ctx.font = "bold 64px sans-serif";
  ctx.fillText(options.mainHeading, CANVAS_SIZE / 2, CANVAS_SIZE - 120);

  ctx.font = "32px sans-serif";
  ctx.fillText(options.subHeading, CANVAS_SIZE / 2, CANVAS_SIZE - 70);
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
