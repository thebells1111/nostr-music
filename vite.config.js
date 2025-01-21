import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 3000,
    proxy: {
      "/ws": {
        target: "ws://localhost:4000", // Example WebSocket server on port 4000
        ws: true,
      },
    },
  },
});
