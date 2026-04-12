import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App";
import "./index.css";

// ✅ GLOBAL ERROR DISPLAY (NO MORE BLANK SCREEN)
window.onerror = function (message, source, lineno, colno, error) {
  document.body.innerHTML = `
    <div style="color:white;padding:20px;background:black;min-height:100vh;">
      <h1>Runtime Error</h1>
      <pre>${message}</pre>
    </div>
  `;
};

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);