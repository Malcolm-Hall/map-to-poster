import type { OverpassRelation, OverpassWay } from "overpass-ts";

export type GeometryElement = OverpassWay | OverpassRelation;

export const OSM_TIMEOUT = 180;

export const OSM_BASE_QUERY = `[out:json][timeout:${OSM_TIMEOUT}]`;
export const ALL_NETWORK_QUERY = `way["highway"]["area"!~"yes"]["highway"!~"abandoned|construction|no|planned|platform|proposed|raceway|razed|rest_area|services"];`;
export const WATER_FEATURES_QUERY = `way[natural=water];way[natural=bay];way[natural=strait];way[waterway=riverbank];way[natural=coastline];`;
