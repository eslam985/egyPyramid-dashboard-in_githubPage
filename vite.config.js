import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // ✅ تغيير الـ base ليتطابق مع اسم المستودع على جيتهاب
  // افترضنا أن اسم المستودع هو egyPyramid-dashboard
  base: '/egyPyramid-dashboard/', 
  
  plugins: [vue(), tailwindcss()],
  
  build: {
    outDir: 'dist', 
    emptyOutDir: true,
    // تحسين البناء لتقليل الحجم
    minify: 'terser',
    sourcemap: false
  }
  // ❌ تم حذف قسم server و proxy لأنهما لا يعملان في البيئة المستضافة (Static)
})