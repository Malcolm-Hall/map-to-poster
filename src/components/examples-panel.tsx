import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

const examples = [
  {
    config: {
      city: "Cape Town",
      country: "South Africa",
      mapRadius: 6000,
      theme: "Blueprint",
    },
    imageSrc: "cape_town_south_africa_blueprint.png",
  },
  {
    config: {
      city: "Durban",
      country: "South Africa",
      mapRadius: 8000,
      theme: "Neon Cyberpunk",
    },
    imageSrc: "durban_south_africa_neon_cyberpunk.png",
  },
  {
    config: {
      city: "Tokyo",
      country: "Japan",
      mapRadius: 15000,
      theme: "Sunset",
    },
    imageSrc: "tokyo_japan_sunset.png",
  },
  {
    config: {
      city: "Dubai",
      country: "UAE",
      mapRadius: 12000,
      theme: "Midnight Blue",
    },
    imageSrc: "dubai_united_arab_emirates_midnight_blue.png",
  },
];

export default function ExamplesPanel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 5_000 })]}
        setApi={setApi}
      >
        <CarouselContent>
          {examples.map(({ imageSrc, config }, idx) => (
            <CarouselItem key={idx}>
              <Card className="relative mx-auto w-full overflow-clip pt-0">
                <img
                  className="hover:cursor-pointer"
                  onClick={() => window.open(`./${imageSrc}`, "_blank")}
                  src={imageSrc}
                />
                <CardHeader>
                  <CardTitle>
                    {config.city}, {config.country}
                  </CardTitle>
                  <CardDescription>
                    <ul>
                      <li>Theme: {config?.theme}</li>
                      <li>Map Radius: {config?.mapRadius}m</li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mt-1 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => api?.scrollPrev()}>
            <ChevronLeft />
          </Button>
          <span>
            {current} of {examples.length}
          </span>
          <Button variant="ghost" onClick={() => api?.scrollNext()}>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </>
  );
}
