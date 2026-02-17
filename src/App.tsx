import InputForm from "@/components/input-form";
import { useState } from "react";
import type { GenerationConfig } from "@/models/generation";
import OutputPanel from "@/components/output-panel";
import ExamplesPanel from "@/components/examples-panel";
import Header from "@/components/header";

export default function App() {
  const [config, setConfig] = useState<GenerationConfig>();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid place-items-center items-start gap-8 lg:grid-cols-5">
          <div className="w-full max-w-lg lg:col-span-2">
            <div className="w-full p-4">
              <InputForm
                onSubmit={setConfig}
                onReset={() => setConfig(undefined)}
              />
            </div>
          </div>
          <div className="w-full lg:col-span-3">
            <div className="p-4">
              {!config ? <ExamplesPanel /> : <OutputPanel config={config} />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
