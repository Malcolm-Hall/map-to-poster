import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCoordinates(lat: number, lon: number) {
  return `${Math.abs(lat).toFixed(4)} ${lat > 0 ? "N" : "S"} / ${Math.abs(lon).toFixed(4)} ${lon > 0 ? "E" : "W"}`;
}
