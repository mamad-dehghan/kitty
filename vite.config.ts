import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  appType: "spa",
  server: {
    // hmr: false,
    open: "/demo",
    strictPort: true,
    host: "0.0.0.0",
    port: 2000,
  },
  resolve: {
    // alias: {
    //   '@': '/src',
    // },
  },
  plugins: [
    // svgr({
    //   include: "**/*.svg",
    //   // exportAsDefault: true,
    //   svgrOptions: {
    //     // exportType: "default",
    //     icon: true,
    //   },
    // }),
    react(),
  ],
});
