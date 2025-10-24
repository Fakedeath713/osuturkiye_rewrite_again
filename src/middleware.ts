import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    return await next();
  } catch (e) {
    console.log(e);
  }
});