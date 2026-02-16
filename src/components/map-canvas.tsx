import { useEffect, useRef } from "react";
import { renderMapPoster, exportCanvasAsPNG } from "@/lib/canvas-renderer";
import { Button } from "@/components/ui/button";
import type { DisplayConfig, PosterResolution } from "@/models/generation";
import type { GeometryElement } from "@/models/osm";
import type { OverpassBbox } from "overpass-ts";
import type { ThemeConfig } from "@/models/theme";

type Props = {
  elements: GeometryElement[];
  waterElements: GeometryElement[];
  parkElements: GeometryElement[];
  bbox: OverpassBbox;
  resolution: PosterResolution;
  theme: ThemeConfig;
  displayConfig: DisplayConfig;
};

export default function MapCanvas({
  elements,
  waterElements,
  parkElements,
  bbox,
  resolution,
  theme,
  displayConfig,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      renderMapPoster(
        canvasRef.current,
        elements,
        waterElements,
        parkElements,
        bbox,
        resolution,
        theme,
        displayConfig,
      );
    }
  }, [
    elements,
    waterElements,
    parkElements,
    bbox,
    resolution,
    theme,
    displayConfig,
  ]);

  const handleDownload = () => {
    if (canvasRef.current) {
      exportCanvasAsPNG(
        canvasRef.current,
        `poster_${displayConfig.mainHeading}_${displayConfig.subHeading}.png`,
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full">
        <Button
          className="w-full hover:cursor-pointer"
          onClick={handleDownload}
        >
          Download as PNG
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        className="max-w-full rounded border border-gray-300"
      />
      <p>
        Map data from{" "}
        <a
          className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800 hover:no-underline"
          href="https://www.openstreetmap.org/copyright"
        >
          OpenStreetMap
        </a>
      </p>
    </div>
  );
}
