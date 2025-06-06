import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    // Increase the file size limit for dev server
    hmr: {
      overlay: false,
    },
    // Configure static file serving
    fs: {
      // Allow serving files from one level up to the project root
      allow: [".."],
    },
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Configure asset handling
    assetsInlineLimit: 0, // Don't inline any assets
    rollupOptions: {
      output: {
        // Handle large assets
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".gltf")) {
            return "assets/models/[name].[ext]";
          }
          return "assets/[name]-[hash].[ext]";
        },
      },
    },
  },
  // Configure MIME types for GLTF files
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  // Optimize dependencies
  optimizeDeps: {
    exclude: ["@google/model-viewer"],
  },
});
