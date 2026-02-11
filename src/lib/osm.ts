import {
  ALL_NETWORK_QUERY,
  OSM_BASE_QUERY,
  PARK_FEATURES_QUERY,
  WATER_FEATURES_QUERY,
} from "@/models/osm";
import {
  overpassJson,
  type OverpassBbox,
  type OverpassJson,
  type OverpassPointGeom,
} from "overpass-ts";
import { degToRad, radToDeg } from "./utils";
import type { PosterResolution } from "@/models/generation";

export async function fetchMapData(bbox: OverpassBbox): Promise<OverpassJson> {
  const query = `${OSM_BASE_QUERY}${formatOverpassBboxQuery(bbox)};(${ALL_NETWORK_QUERY});out geom;`;
  return await overpassJson(query);
}

export async function fetchWaterData(bbox: OverpassBbox) {
  const query = `${OSM_BASE_QUERY}${formatOverpassBboxQuery(bbox)};(${WATER_FEATURES_QUERY});out geom;`;
  return await overpassJson(query);
}

export async function fetchParkData(bbox: OverpassBbox) {
  const query = `${OSM_BASE_QUERY}${formatOverpassBboxQuery(bbox)};(${PARK_FEATURES_QUERY});out geom;`;
  return await overpassJson(query);
}

const EARTH_RADIUS_METERS = 6_371_000;

export function bboxFromPoint(
  { lat, lon }: OverpassPointGeom,
  radiusMeters: number,
  resolution: PosterResolution,
): OverpassBbox {
  let adjustedX: number;
  let adjustedY: number;
  if (resolution.width > resolution.height) {
    adjustedX = radiusMeters;
    adjustedY = (radiusMeters * resolution.height) / resolution.width;
  } else {
    adjustedX = (radiusMeters * resolution.width) / resolution.height;
    adjustedY = radiusMeters;
  }

  const delta_lat = radToDeg(adjustedY / EARTH_RADIUS_METERS);
  const delta_lon =
    radToDeg(adjustedX / EARTH_RADIUS_METERS) / Math.cos(degToRad(lat));
  const top = lat + delta_lat;
  const bottom = lat - delta_lat;
  const right = lon + delta_lon;
  const left = lon - delta_lon;
  return {
    minlon: left,
    minlat: bottom,
    maxlon: right,
    maxlat: top,
  };
}

function formatOverpassBboxQuery({
  minlat,
  minlon,
  maxlat,
  maxlon,
}: OverpassBbox) {
  return `[bbox:${minlat}, ${minlon}, ${maxlat}, ${maxlon}]`;
}
