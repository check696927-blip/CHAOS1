import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App";
import "./index.css";

function SafeApp() {
  try {
    return <App />;
  } catch (error) {
    console.error("App crashed:", error);
    return (
      <div style={{ color: "white", padding: "20px" }}>
        App failed to load.
      </div>
    );
  }
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <SafeApp />
  </QueryClientProvider>
);