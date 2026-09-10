import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static export.
   *
   * Every route in this app is prerendered — there are no API routes, no
   * middleware, no server actions and no server-side data fetching. Exporting
   * to plain HTML makes hosting trivial and removes a whole class of runtime
   * failure from the deploy.
   *
   * When an intake API or a database is added, remove this line and deploy on
   * a Node runtime instead (on Netlify that means the @netlify/plugin-nextjs
   * runtime and dropping `publish` from netlify.toml).
   */
  output: "export",

  /**
   * Emit /choose-land/index.html rather than /choose-land.html, so the URLs
   * resolve identically on any static host without relying on host-specific
   * "clean URL" rewriting.
   */
  trailingSlash: true,
};

export default nextConfig;
