import { useEffect, useRef } from "react";
import { renderMapPoster, exportCanvasAsPNG } from "@/lib/canvas-renderer";
import { Button } from "@/components/ui/button";
import type { DisplayConfig, PosterResolution } from "@/models/generation";
import type { GeometryElement } from "@/models/osm";
import type { OverpassBbox } from "overpass-ts";

type Props = {
  elements: GeometryElement[];
  waterElements: GeometryElement[];
  parkElements: GeometryElement[];
  bbox: OverpassBbox;
  resolution: PosterResolution;
  displayConfig: DisplayConfig;
};

export default function MapCanvas({
  elements,
  waterElements,
  parkElements,
  bbox,
  resolution,
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
        displayConfig,
      );
    }
  }, [elements, waterElements, parkElements, bbox, resolution, displayConfig]);

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
      <canvas ref={canvasRef} className="rounded border border-gray-300" />
      <Button onClick={handleDownload}>Download as PNG</Button>
    </div>
  );
}
