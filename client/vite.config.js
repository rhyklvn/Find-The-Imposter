import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".", // <-- points Vite to the current folder (client/)
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/socket.io": {
        target: "http://localhost:3001",
        ws: true,
      },
    },
  },
  build: {
    outDir: "../dist", // optional: outputs build to root dist folder
  },
});