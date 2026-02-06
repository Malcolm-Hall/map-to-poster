import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

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

const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: localStoragePersister }}
    >
      <App />
    </PersistQueryClientProvider>
  </StrictMode>,
);
