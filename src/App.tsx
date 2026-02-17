import InputForm from "@/components/input-form";
import { useState } from "react";
import type { GenerationConfig } from "@/models/generation";
import OutputPanel from "@/components/output-panel";
import Header from "@/components/header";
import Hero from "@/components/hero";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
  const [config, setConfig] = useState<GenerationConfig>();

  return (
    <>
      <Header />
      <Hero />
      <main id="generator" className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid place-items-center items-start gap-8 lg:grid-cols-5">
          <div
            className="w-full max-w-lg lg:col-span-2"
            style={{ gridColumn: !config ? "span 5 / span 5" : "" }}
          >
            <div className="w-full p-4">
              <Card>
                <CardContent>
                  <InputForm
                    onSubmit={setConfig}
                    onReset={() => setConfig(undefined)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          {!!config && (
            <div className="w-full lg:col-span-3">
              <div className="p-4">
                <OutputPanel config={config} />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
