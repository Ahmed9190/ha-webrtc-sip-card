import { defineConfig } from "vite";
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/card.ts'),
      name: 'WebRTCSipCard',
      fileName: (format) => `ha-webrtc-sip-card.${format}.js`,
    },
    rollupOptions: {
      output: {
        // Ensure each entry is a separate file
        manualChunks: undefined,
        format: "esm",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      },
    },
    target: "es2017",
    minify: false,
    // Ensure all assets are copied to dist
    assetsInlineLimit: 0,
    copyPublicDir: false,
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
    __VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
  },
});
