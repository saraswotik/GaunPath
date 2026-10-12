import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // In development, send /api calls to the local Python (FastAPI) server.
  server: { proxy: { "/api": "http://localhost:8000" } },
});
