import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    sourcemap: false, // Disable source maps
    lib: {
      entry: {
        "ha-webrtc-sip-card": "./src/card.ts",
        "ha-webrtc-sip-card-editor": "./src/editor.ts",
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    outDir: "./dist",
    emptyOutDir: true,
    rollupOptions: {
      external: [],
      output: {
        // Ensure each entry is a separate file
        manualChunks: undefined,
        format: "esm",
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      },
    },
    target: "es2017",
    minify: false,
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
    __VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
  },
});
