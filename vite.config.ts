import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "tsconfig.build.json",
      cleanVueFileName: true,
      exclude: ["src/test/**"],
    }),
  ],

  build: {
    lib: {
      name: "wizz-validate",
      // fileName: "index",
      entry: [resolve(__dirname, "src/index.ts"), resolve(__dirname, "src/valibot.ts")],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library (Vue)
      external: ["vue", "zod"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          zod: "Zod",
        },
      },
    },
  },
});
