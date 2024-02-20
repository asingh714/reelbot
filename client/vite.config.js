import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import alias from "@rollup/plugin-alias";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./src/Components"),
      "@assets": resolve(__dirname, "./src/assets"),
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        alias({
          entries: [
            {
              find: "@components",
              replacement: resolve(__dirname, "./src/Components"),
            },
            {
              find: "@assets",
              replacement: resolve(__dirname, "./src/assets"),
            },
          ],
        }),
      ],
    },
  },
});
