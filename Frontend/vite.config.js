import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from 'url';

// https://vite.dev/config/
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
   plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@assets": path.resolve(__dirname, "./src/assets"),
         "@config": path.resolve(__dirname, "./src/config")
         
    },
  },
})
