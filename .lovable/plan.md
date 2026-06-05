# Add Google Analytics

Embed the GA4 tracking snippet (measurement ID `G-SHJB0BPY25`) so pageviews flow into your Google Analytics property.

## Change

**`index.html`** — Add the two `<script>` tags inside `<head>`, placed just before the closing `</head>` so they load on every page without blocking the hero image preload:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SHJB0BPY25"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-SHJB0BPY25');
</script>
```

That's it — since the app is a SPA (React Router), GA will automatically log the initial pageview. If you later want route-change pageviews tracked too, we can add a small `useEffect` hook that calls `gtag('event', 'page_view', ...)` on navigation; let me know if you want that included.

## Verification

After deploy, open the site and check **Google Analytics → Reports → Realtime** — your session should appear within ~30 seconds.
