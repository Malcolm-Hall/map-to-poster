import InputForm from "@/components/input-form";
import { useState } from "react";
import type { GenerationConfig } from "@/models/generation";
import OutputPanel from "@/components/output-panel";
import Header from "@/components/header";
import Hero from "@/components/hero";
import { Card, CardContent } from "@/components/ui/card";
import { IndicatorInfo } from "./components/indicator";

export default function App() {
  const [config, setConfig] = useState<GenerationConfig>();

  return (
    <>
      <Header />
      <div className="via-background bg-linear-to-r from-blue-50 to-blue-50">
        <Hero />
        <main id="generator" className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid place-items-center items-start gap-4 lg:grid-cols-5">
            <div className="w-full max-w-lg lg:col-span-2">
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
            <div className="h-full w-full py-4 lg:col-span-3">
              <Card className="h-full">
                <CardContent>
                  {!config ? (
                    <IndicatorInfo title="Generate a poster to preview it here" />
                  ) : (
                    <OutputPanel config={config} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
