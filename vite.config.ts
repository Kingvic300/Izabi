import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "localhost",
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "pdfjs-dist/build/pdf.worker.min": "pdfjs-dist/build/pdf.worker.min?url",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
          'vendor-pdf': ['react-pdf', 'pdfjs-dist'],
          'vendor-charts': ['recharts'],
          'vendor-gsap': ['gsap', '@gsap/react'],
          'vendor-editor': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-underline', '@tiptap/extension-link', '@tiptap/extension-placeholder'],
          'vendor-utils': ['axios', 'lucide-react', 'framer-motion', 'date-fns', 'zod', 'string-similarity'],
        }
      }
    }
  }
});
