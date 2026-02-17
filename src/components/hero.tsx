import { ArrowRight } from "lucide-react";
import ExamplesPanel from "./examples-panel";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="pt-25 lg:h-dvh">
      <div className="mx-auto h-full max-w-7xl px-8">
        <div className="mr-auto h-full place-items-center lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="mb-4 lg:col-span-2">
            <h1 className="mb-4 text-5xl leading-none font-extrabold tracking-tight lg:text-6xl">
              Map To Poster
            </h1>
            <p className="text-muted-foreground mb-4 text-lg font-light lg:text-xl">
              Generate beautiful, minimalist map posters for any city in the
              world
            </p>
            <Button asChild>
              <a href="#generator">
                Get Started <ArrowRight />
              </a>
            </Button>
          </div>
          <div className="lg:col-span-3" id="examples">
            <ExamplesPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
