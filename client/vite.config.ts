import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: mode === 'production' ? '/static/' : '/',  // Used to serve files correctly in production
  build: {
    outDir: "dist",
    assetsDir: "",
  },
}))
