import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App";
import "./index.css";
import React from "react";

// ✅ GLOBAL UNHANDLED ERROR DISPLAY
window.onerror = function (message, _source, _lineno, _colno, _error) {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <div style="color:white;padding:40px;background:#0a0a18;min-height:100vh;font-family:sans-serif;">
        <h1 style="color:#ff0055;">Runtime Error</h1>
        <pre style="color:#ccc;font-size:14px;white-space:pre-wrap;">${message}</pre>
        <button onclick="window.location.reload()" style="margin-top:20px;padding:10px 20px;background:#9D00FF;color:white;border:none;border-radius:6px;cursor:pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
};

window.onunhandledrejection = function (event) {
  console.error("Unhandled Promise rejection:", event.reason);
};

// ✅ TOP-LEVEL REACT ERROR BOUNDARY
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("React Error Boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            color: "white",
            padding: "40px",
            background: "#0a0a18",
            minHeight: "100vh",
            fontFamily: "sans-serif",
          }}
        >
          <h1 style={{ color: "#ff0055" }}>Something went wrong</h1>
          <pre
            style={{
              color: "#ccc",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
            }}
          >
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#9D00FF",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <RootErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </RootErrorBoundary>
);