# sketchD logo files

Drop these into `client/public/` then update `client/index.html` and the toolbar/landing component to use them.

## Files included

| File | Use |
|---|---|
| `sketchd-logo-full.svg` | full lockup — landing hero, marketing |
| `sketchd-app-icon.svg` | square app icon — header logo, social profiles |
| `favicon.ico` | classic favicon (multi-size: 16/32/48) |
| `favicon-16x16.png` | tiny browser tab |
| `favicon-32x32.png` | standard favicon |
| `favicon-32.svg` | modern SVG favicon |
| `apple-touch-icon.png` | iOS home screen (180×180) |
| `icon-192.png` | PWA manifest icon |
| `icon-512.png` | PWA manifest icon |
| `og-image.png` | social sharing card (1200×630) |
| `og-image.svg` | OG image source |

## Install steps

**1. Copy all files into `client/public/`:**
```bash
cp /path/to/sketchd-logo/* client/public/
```

**2. Update `client/index.html`** — replace the head section with:

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/svg+xml" href="/favicon-32.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Meta -->
<title>sketchD — sketch to code</title>
<meta name="description" content="Draw a wireframe, get working React code. No prompts, no boilerplate.">

<!-- Open Graph -->
<meta property="og:title" content="sketchD — sketch to code">
<meta property="og:description" content="Draw a wireframe, get working React code. No prompts, no boilerplate.">
<meta property="og:image" content="/og-image.png">
<meta property="og:type" content="website">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="/og-image.png">
```

**3. Use the icon in your UI** — wherever you have the text `sketchd.`, you can replace it with the inline SVG icon. The icon SVG is small enough to inline directly. Example for Toolbar:

```tsx
<div className="flex items-center gap-2" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
  <img src="/sketchd-app-icon.svg" width={28} height={28} alt="sketchD" />
  <span className="font-medium tracking-tight" style={{ fontSize: 20 }}>
    sketchD<span style={{ color: '#d4c4a0' }}>.</span>
  </span>
</div>
```

Brand colors:
- Background: `#0a0a0c`
- Foreground: `#e8e4dc`
- Accent: `#d4c4a0`
