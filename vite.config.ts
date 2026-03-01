import { defineConfig } from "vite";
import vitePluginWasm from "vite-plugin-wasm";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vitePluginWasm()],
  server: {
    port: 8080,
    open: true,
  },
});
