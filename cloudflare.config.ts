import { bindings, defineConfig, defineWorker } from "cf/config";
import { createWorkersResponseStoreSelfContainedConfig } from "@vinext/cloudflare/cache/config";

const cache = await createWorkersResponseStoreSelfContainedConfig({
  worker: "horoscope",
  bucket: "horoscope-response-store-cache-bodies",
});

export default defineConfig({
  worker: defineWorker({
    ...cache,
    name: "horoscope",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-07",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ...cache.env,
      ASSETS: bindings.assets(),
      FREEASTROAPI_API_KEY: bindings.secret(),
      FREEASTROAPI_BASE_URL: bindings.secret(),
    },
  }),
});
