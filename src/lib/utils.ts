import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCoordinates(lat: number, lon: number) {
  return `${Math.abs(lat).toFixed(4)}° ${lat > 0 ? "N" : "S"} / ${Math.abs(lon).toFixed(4)}° ${lon > 0 ? "E" : "W"}`;
}

export function radToDeg(angleRad: number): number {
  return (angleRad * 180) / Math.PI;
}

export function degToRad(angleDeg: number): number {
  return (angleDeg * Math.PI) / 180;
}
