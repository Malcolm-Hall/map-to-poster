import { useEffect, useRef } from "react";
import { renderMapPoster, exportCanvasAsPNG } from "@/lib/canvas-renderer";
import { Button } from "@/components/ui/button";
import type { DisplayConfig } from "@/models/generation";
import type { GeometryElement } from "@/models/osm";
import type { OverpassBbox } from "overpass-ts";

type Props = {
  elements: GeometryElement[];
  waterElements: GeometryElement[];
  parkElements: GeometryElement[];
  bbox: OverpassBbox;
  displayConfig: DisplayConfig;
};

export default function MapCanvas({
  elements,
  waterElements,
  parkElements,
  bbox,
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
        displayConfig,
      );
    }
  }, [elements, bbox, displayConfig]);

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
      <canvas
        ref={canvasRef}
        className="max-w-full rounded border border-gray-300"
      />
      <Button onClick={handleDownload}>Download as PNG</Button>
    </div>
  );
}
