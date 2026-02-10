import type { OverpassRelation, OverpassWay } from "overpass-ts";

export type GeometryElement = OverpassWay | OverpassRelation;

export const OSM_TIMEOUT = 180;

export const ALL_NETWORK_QUERY = `["highway"]["area"!~"yes"]["highway"!~"abandoned|construction|no|planned|platform|proposed|raceway|razed|rest_area|services"]`;
