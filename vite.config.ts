import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ESM (IMPORTANT)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor chunks cleanly
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor";
            if (id.includes("@radix-ui")) return "ui-vendor";
            if (id.includes("framer-motion")) return "motion-vendor";
            if (id.includes("@supabase")) return "supabase-vendor";
            if (id.includes("zustand")) return "store-vendor";

            return "vendor";
          }
        },
      },
    },
  },

  server: {
    host: true,
    port: 5173,
  },
});
