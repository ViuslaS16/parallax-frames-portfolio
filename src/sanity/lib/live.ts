// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Required for Live Content API WebSocket in production.
  // Set NEXT_PUBLIC_SANITY_API_READ_TOKEN in Vercel env vars (use a "Viewer" token from sanity.io/manage).
  browserToken: process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN,
});
