import InputForm from "@/components/input-form";
import { useState } from "react";
import type { GenerationConfig } from "@/models/generation";
import OutputPanel from "@/components/output-panel";

export default function App() {
  const [config, setConfig] = useState<GenerationConfig>();

  return (
    <main>
      <InputForm onSubmit={setConfig} />
      {!!config && <OutputPanel config={config} />}
    </main>
  );
}
