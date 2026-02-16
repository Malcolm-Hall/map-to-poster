import InputForm from "@/components/input-form";
import { useState } from "react";
import type { GenerationConfig } from "@/models/generation";
import OutputPanel from "@/components/output-panel";
import ExamplesPanel from "@/components/examples-panel";

export default function App() {
  const [config, setConfig] = useState<GenerationConfig>();

  return (
    <main className="flex flex-col items-center">
      <div className="w-full max-w-lg min-w-2xs p-4">
        <InputForm onSubmit={setConfig} onReset={() => setConfig(undefined)} />
      </div>
      <div className="min-h-20 w-full max-w-lg min-w-2xs p-4">
        {!config ? <ExamplesPanel /> : <OutputPanel config={config} />}
      </div>
    </main>
  );
}
