import { defineConfig } from "vite";
import svelteSVG from "vite-plugin-svelte-svg";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelteSVG({
      svgoConfig: {}, // See https://github.com/svg/svgo#configuration
      requireSuffix: false, // Set false to accept '.svg' without the '?component'
    }),
    svelte(),
  ],
});
