import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "dist", "client"),
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, "client", "src", "main.tsx"),
      output: {
        entryFileNames: "app.js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css") ? "app.css" : "assets/[name][extname]",
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./client/src/test/setup.ts",
    include: ["client/src/**/*.test.tsx"],
  },
});
