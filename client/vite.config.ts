import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";

const target = process.env.API_URL || "https://verifyx-backend.onrender.com";

export default defineConfig({
  plugins: [
    tanstackStart(),
    nitro({
      routeRules: {
        "/api/**": {
          proxy: `${target}/api/**`,
        },
        "/uploads/**": {
          proxy: `${target}/uploads/**`,
        },
      },
    }),
    tailwindcss(),
    react(),
  ],
  resolve: { tsconfigPaths: true },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
