import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <a href="/map-to-poster/" className="text-lg font-semibold">
          Map To Poster
        </a>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <a
              href="https://github.com/malcolm-hall/map-to-poster"
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon />
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
