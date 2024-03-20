import path from "node:path"
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import VueRouter from 'unplugin-vue-router/vite'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },

  plugins: [VueRouter(), vue()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "wizz-validate/valibot": path.resolve(__dirname, "../../src/valibot/index.ts"),
      "wizz-validate": path.resolve(__dirname, "../../src/index.ts"),
    },
  },
});
