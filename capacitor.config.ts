import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.cookingkitchenpartners",
  appName: "Cooking Kitchen Partners",
  // `bun run build` prerenders every screen into dist/client, so the packaged
  // app runs fully offline with no server.
  webDir: "dist/client",
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
