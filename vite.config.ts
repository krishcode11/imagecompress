import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Dynamic plugins for Replit Dev Mode
const isReplit = process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined;

export default defineConfig(async () => ({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(isReplit ? [ (await import("@replit/vite-plugin-cartographer")).cartographer() ] : []),
  ],

  root: path.resolve(__dirname, "client"),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  build: {
    outDir: path.resolve(__dirname, "dist"), // ✅ Changed from dist/public → just dist (simpler Netlify setup)
    emptyOutDir: true,
  },

  publicDir: path.resolve(__dirname, "public"),

  server: {
    port: 5173,
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        configure: (proxy: any, _options: any) => {
          proxy.on("error", (err: any, _req: any, _res: any) => {
            console.log("🔴 Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyRes: any, req: any, _res: any) => {
            console.log("➡️  Request to Backend:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes: any, req: any, _res: any) => {
            console.log("⬅️  Response from Backend:", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom"],
  },
}));
