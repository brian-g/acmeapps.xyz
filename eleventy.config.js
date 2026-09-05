export default function (eleventyConfig) {
  // Site root files (_headers, robots.txt, favicons) live in src/public
  // and are copied to the top of _site.
  eleventyConfig.addPassthroughCopy({ "src/public": "." });

  // CSS ships as-is — no build step.
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addWatchTarget("src/assets/css/");

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
