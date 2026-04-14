import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/egyPyramid-dashboard-in_githubPage/', // تأكد أن الاسم يطابق تماماً اسم المستودع
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: 'dist', 
    emptyOutDir: true,
    // ✅ احذف سطر terser أو غيره لـ 'esbuild' وهو الافتراضي
    minify: 'esbuild', 
    sourcemap: false
  }
})