import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: 'http://custom-options.test',
        // target: "https://develop-lf-custom-options.lfszo.codefriend.top",
        changeOrigin: true,
      },
    },
  },
});
