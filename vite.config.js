import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { presetWind3 } from "@unocss/preset-wind3";
import { presetIcons } from "@unocss/preset-icons";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  plugins: [
    UnoCSS({
      presets: [presetWind3(), presetIcons()],
      transformers: [transformerDirectives()],
    }),
    vue(),
    {
      name: "full-reload",
      handleHotUpdate({ server }) {
        server.ws.send({ type: "full-reload" });
        return [];
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
