---
layout: base.njk
title: About
description: What Acme Apps is and who builds it.
---

# About

This page is Markdown, rendered through the same Nunjucks layout as everything
else — which means site data works here too: **{{ site.title }}**.

Front matter on each page sets `title` and an optional `description`; the layout
falls back to the site-wide description when a page omits it.

## Contact

Reach out at [{{ site.author.email }}](mailto:{{ site.author.email }}).
