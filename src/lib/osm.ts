import { RADIUS_METERS } from "@/models/generation";
import {
  ALL_NETWORK_QUERY,
  OSM_TIMEOUT,
  type Bounds,
  type GeometryElement,
} from "@/models/osm";
import { overpassJson, type OverpassJson } from "overpass-ts";

export async function fetchMapData(
  lat: number,
  lon: number,
): Promise<OverpassJson> {
  const query = `[out:json][timeout:${OSM_TIMEOUT}];(way${ALL_NETWORK_QUERY}(around:${RADIUS_METERS},${lat},${lon}););out geom;`;
  return await overpassJson(query);
}

export function computeBounds(elements: GeometryElement[]): Bounds {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  for (const el of elements) {
    if (!el.geometry) continue;
    for (const point of el.geometry) {
      minLat = Math.min(minLat, point.lat);
      maxLat = Math.max(maxLat, point.lat);
      minLon = Math.min(minLon, point.lon);
      maxLon = Math.max(maxLon, point.lon);
    }
  }

  return { minLat, maxLat, minLon, maxLon };
}

export function projectCoordinate(
  lat: number,
  lon: number,
  bounds: Bounds,
  canvasSize: number,
): { x: number; y: number } {
  const x =
    ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * canvasSize;
  const y =
    canvasSize -
    ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * canvasSize;
  return { x, y };
}
