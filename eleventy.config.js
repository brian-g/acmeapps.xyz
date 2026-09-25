import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

export default function (eleventyConfig) {
  // Site root files (_headers, robots.txt, favicons) live in src/public
  // and are copied to the top of _site.
  eleventyConfig.addPassthroughCopy({ "src/public": "." });

  // CSS ships as-is — no build step.
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addWatchTarget("src/assets/css/");

  // Appends a content hash to an asset URL so long-cached files bust on change.
  // Root URLs may come from src/public (see passthrough above).
  eleventyConfig.addFilter("versioned", (url) => {
    const source = [`src${url}`, `src/public${url}`].find(existsSync);
    if (!source) throw new Error(`versioned: no source file for ${url}`);
    const hash = createHash("sha256")
      .update(readFileSync(source))
      .digest("hex")
      .slice(0, 10);
    return `${url}?v=${hash}`;
  });

  eleventyConfig.addFilter("readableDate", (value) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(value instanceof Date ? value : new Date(value));
  });

  eleventyConfig.addFilter("year", (value) => {
    return (value instanceof Date ? value : new Date(value)).getUTCFullYear();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
