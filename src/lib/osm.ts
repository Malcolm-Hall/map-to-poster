import { ALL_NETWORK_QUERY, OSM_TIMEOUT } from "@/models/osm";
import {
  overpassJson,
  type OverpassBbox,
  type OverpassJson,
  type OverpassPointGeom,
} from "overpass-ts";
import { degToRad, radToDeg } from "./utils";

export async function fetchMapData(bbox: OverpassBbox): Promise<OverpassJson> {
  const query = `[out:json][timeout:${OSM_TIMEOUT}]${formatOverpassBboxQuery(bbox)};(way${ALL_NETWORK_QUERY};);out geom;`;
  return await overpassJson(query);
}

const EARTH_RADIUS_METERS = 6_371_000;

export function bboxFromPoint(
  { lat, lon }: OverpassPointGeom,
  radiusMeters: number,
): OverpassBbox {
  const delta_lat = radToDeg(radiusMeters / EARTH_RADIUS_METERS);
  const delta_lon =
    radToDeg(radiusMeters / EARTH_RADIUS_METERS) / Math.cos(degToRad(lat));
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
