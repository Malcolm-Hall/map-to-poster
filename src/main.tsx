import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const HALF_DAY_MILLIS = 1000 * 60 * 60 * 12;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: HALF_DAY_MILLIS,
      gcTime: HALF_DAY_MILLIS,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
