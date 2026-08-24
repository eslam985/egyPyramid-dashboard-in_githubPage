import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/egyPyramid-dashboard-in_githubPage/",
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    minify: "esbuild",
    sourcemap: false,
    target: "esnext",
    // 🌟 أضف هذا الجزء لتغيير نمط أسماء الملفات وحذف أي شرطة سفلية تسبب 404
    rollupOptions: {
      output: {
        sanitizeFileName(name) {
          return name.replace(/[^a-zA-Z0-9-.]/g, ""); // يحذف الحروف الغريبة والشرطات السفلية المتداخلة
        },
        chunkFileNames: "assets/chunk-[name]-[hash].js",
        entryFileNames: "assets/entry-[name]-[hash].js",
        assetFileNames: "assets/asset-[name]-[hash].[ext]",
      },
    },
  },
  esbuild: {
    target: "esnext",
  },
});
