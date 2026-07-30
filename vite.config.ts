import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  mode: "production",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router") ||
            id.includes("node_modules/scheduler")
          )
            return "vendor-react";
          if (
            id.includes("node_modules/@reduxjs") ||
            id.includes("node_modules/react-redux") ||
            id.includes("node_modules/redux-persist") ||
            id.includes("node_modules/immer") ||
            id.includes("node_modules/@tanstack")
          )
            return "vendor-state";
          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/@floating-ui") ||
            id.includes("node_modules/sonner") ||
            id.includes("node_modules/lucide-react")
          )
            return "vendor-ui";
          if (id.includes("node_modules/gsap")) return "vendor-gsap";
          if (
            id.includes("node_modules/zod") ||
            id.includes("node_modules/react-hook-form")
          )
            return "vendor-validation";
          if (id.includes("node_modules/axios")) return "vendor-axios";
        },
        // manualChunks: {
        //   // ── vendor main ─────────────────
        //   "vendor-react": ["react", "react-dom", "react-router-dom"],

        //   "vendor-state": [
        //     "@reduxjs/toolkit",
        //     "react-redux",
        //     "redux-persist",
        //     "@tanstack/react-query",
        //   ],
        //   "vendor-ui": [
        //     "@radix-ui/react-dialog",
        //     "@radix-ui/react-dropdown-menu",
        //     "sonner",
        //   ],
        //   "vendor-icons": ["lucide-react"],
        //   "vendor-gsap": ["gsap", "gsap/ScrollTrigger"],
        // },
      },
    },
  },

  plugins: [
    react(),
    basicSsl(),
    tailwindcss(),
    // react({
    //   babel: {
    //     plugins: [["babel-plugin-react-compiler"]],
    //     presets: [
    //       [
    //         "@babel/preset-env",
    //         {
    //           modules: false,
    //         },
    //       ],
    //     ],
    //   },
    // }),
  ],
});
