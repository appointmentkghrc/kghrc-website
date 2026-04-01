import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

/** Avoid edge/CDN caching upload responses; uploads must stay dynamic. */
export const dynamic = "force-dynamic";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
});
