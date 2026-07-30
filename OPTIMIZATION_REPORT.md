# BookWise Project - Performance Optimization Report

## Resource Hints & Tree Shaking Optimization Analysis

---

## 1. Resource Hints Optimization

### Current State Analysis

The project currently has **basic preconnect hints** for Google Fonts in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

### Recommended Resource Hints Implementation

#### A. DNS Prefetch (`dns-prefetch`)
Use for origins that will be needed later but not immediately critical.

```html
<!-- In index.html <head> -->
<link rel="dns-prefetch" href="https://api.bookwise.com" />
<link rel="dns-prefetch" href="https://cdn.bookwise.com" />
<link rel="dns-prefetch" href="https://analytics.bookwise.com" />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://fonts.gstatic.com" />
```

**Vite Plugin Approach** (auto-inject via `vite-plugin-dns-prefetch`):
```bash
npm install -D vite-plugin-dns-prefetch
```

```typescript
// vite.config.ts
import dnsPrefetch from 'vite-plugin-dns-prefetch';

export default defineConfig({
  plugins: [
    dnsPrefetch({
      hostnames: [
        'api.bookwise.com',
        'cdn.bookwise.com',
        'analytics.bookwise.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com'
      ]
    }),
    // ... other plugins
  ]
});
```

#### B. Preconnect (`preconnect`)
Use for critical third-party origins (already partially implemented).

```html
<!-- In index.html <head> - Expand current implementation -->
<link rel="preconnect" href="https://api.bookwise.com" />
<link rel="preconnect" href="https://cdn.bookwise.com" crossorigin />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

**Vite Plugin Approach** (auto-inject):
```bash
npm install -D vite-plugin-preconnect
```

```typescript
// vite.config.ts
import preconnect from 'vite-plugin-preconnect';

export default defineConfig({
  plugins: [
    preconnect({
      origins: [
        'https://api.bookwise.com',
        'https://cdn.bookwise.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ]
    }),
    // ... other plugins
  ]
});
```

#### C. Preload (`preload`)
Critical resources needed for current page.

```html
<!-- In index.html <head> -->
<!-- Preload critical CSS -->
<link rel="preload" href="/assets/index-DpGUq1W4.css" as="style" />

<!-- Preload critical JS bundles (after build, use dynamic injection) -->
<link rel="preload" href="/assets/index-KtOXSMPN.js" as="script" />

<!-- Preload hero image -->
<link rel="preload" href="/images/hero-image.webp" as="image" type="image/webp" />

<!-- Preload fonts -->
<link rel="preload" href="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2" as="font" type="font/woff2" crossorigin />
```

**Vite Auto-Preload** (using `vite-plugin-preload`):
```bash
npm install -D vite-plugin-preload
```

```typescript
// vite.config.ts
import { preload } from 'vite-plugin-preload';

export default defineConfig({
  plugins: [
    preload({
      include: ['initial'],
      asType: {
        '.js': 'script',
        '.css': 'style',
        '.woff2': 'font',
        '.webp': 'image'
      }
    }),
    // ... other plugins
  ]
});
```

#### D. Prefetch (`prefetch`)
Resources for likely future navigation.

```html
<!-- In index.html <head> or injected via JS -->
<link rel="prefetch" href="/assets/BooksPage-CWrKAQkX.js" as="script" />
<link rel="prefetch" href="/assets/BasketPage-DZsIJDFO.js" as="script" />
<link rel="prefetch" href="/assets/Checkout-CrXwUEeb.js" as="script" />
<link rel="prefetch" href="/assets/Profile-B5hP5q33.js" as="script" />
```

**Programmatic Prefetching** (React Router v7 + Vite):
```typescript
// src/hooks/useRoutePrefetch.ts
import { useEffect } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';

export function useRoutePrefetch() {
  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    // Prefetch likely next routes based on current location
    const prefetchRoutes: Record<string, string[]> = {
      '/': ['/library', '/login', '/register'],
      '/library': ['/library/books/:id', '/library/basket', '/library/wishlisted'],
      '/library/basket': ['/library/checkout'],
      '/library/checkout': ['/library/payment-result', '/library/confirmed-payment'],
    };

    const nextRoutes = prefetchRoutes[location.pathname] || [];
    
    nextRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      link.as = 'script';
      document.head.appendChild(link);
    });
  }, [location.pathname]);
}
```

**Advanced: Speculation Rules API** (modern browsers):
```html
<!-- In index.html <head> -->
<script type="speculationrules">
{
  "prefetch": [
    { "source": "list", "urls": ["/library", "/login", "/register"] },
    { "where": { "and": [{ "href_matches": "/library/*" }] } }
  ],
  "prerender": [
    { "source": "list", "urls": ["/library"] }
  ]
}
</script>
```

---

## 2. Tree Shaking Optimization

### Current State Analysis

**Good practices already in place:**
- `sideEffects: ["*.css"]` in package.json (correct - only CSS has side effects)
- ES modules (`"type": "module"`)
- Dynamic imports with `React.lazy()` for route-level code splitting
- Vite (Rollup) handles tree shaking automatically

**Areas for improvement:**
- Some dependencies may have unused exports
- Need to verify no CommonJS imports leaking in
- Barrel file exports may prevent tree shaking

سؤال ممتاز جدًا 👌
ده **مستوى متقدم** وبييجي فعلًا في شغل Production و Interviews.
خلّينا نمشي **من الأساس → للحلول العملية**.

---

# 1️⃣ ما هي أشكال الـ Side Effects؟ 🧨

**Side Effect** يعني:

> كود بيتنفّذ بمجرد ما الملف يتعمله `import`
> حتى لو أنت **مش مستخدم أي export منه**.

---

## 🔴 أشهر أشكال Side Effects

### 1️⃣ تنفيذ كود فورًا عند الاستيراد

```js id="a1"
console.log('hello'); // Side effect
export function test() {}
```

---

### 2️⃣ تعديل متغيرات Global

```js id="a2"
window.isLoggedIn = true;
export {};
```

---

### 3️⃣ تعديل Prototype

```js id="a3"
Array.prototype.myFunc = function () {};
export {};
```

---

### 4️⃣ تسجيل Event Listeners

```js id="a4"
window.addEventListener('resize', () => {});
export {};
```

---

### 5️⃣ Polyfills

```js id="a5"
import 'core-js/es/promise';
```

---

### 6️⃣ CSS Imports

```js id="a6"
import './global.css';
```

> CSS دايمًا Side Effect
> لأن مجرد تحميله بيغير شكل الصفحة

---

### 7️⃣ تهيئة Libraries (Initialization)

```js id="a7"
import i18n from './i18n';
i18n.init();
```

---

# 2️⃣ ليه Tree Shaking يخاف من Side Effects؟ 🤔

Tree Shaking بيقول:

> "لو شلت الملف ده… هل هيكسر حاجة؟"

لو الملف فيه Side Effect:
❌ مش هيقدر يحذفه
لأنه ممكن يكون ليه تأثير على التطبيق

---

# 3️⃣ عندي ملفات فيها Side Effects… أعمل إيه؟ ✅

### الحل الرسمي والصحيح 🔥

تقول للـ bundler:

> "الملفات دي **استثناء** — متتحذفش"

---

## 4️⃣ الطريقة الصحيحة: `sideEffects` في package.json ⭐

### الحالة 1️⃣ كل المشروع Side-effect free

```json id="se1"
{
  "sideEffects": false
}
```

---

### الحالة 2️⃣ في ملفات معينة فيها Side Effects (الأشهر) ✅

```json id="se2"
{
  "sideEffects": [
    "*.css",
    "./src/polyfills.js",
    "./src/i18n/setup.js"
  ]
}
```

📌 المعنى:

* أي ملف غير دول → Tree Shaking مسموح
* الملفات دي → ❌ لا تحذفها حتى لو مش مستخدمة

---

# 6️⃣ طريقة ذكية (Best Practice) 🧠

### افصل الكود:

❌ كده غلط:

```js id="bp1"
console.log('init');
export function helper() {}
```

✅ كده صح:

```js id="bp2"
// init.js (side effect)
console.log('init');
```

```js id="bp3"
// helpers.js (pure)
export function helper() {}
```

---
# 8️⃣ خلاصة Interview جاهزة 🎯

> **Side effects** هي أي كود بيتنفذ وقت الاستيراد.
> Tree Shaking لا يحذف الملفات التي قد يكون لها تأثير جانبي.
> نحدد الملفات ذات الـ side effects باستخدام `sideEffects` في `package.json` حتى لا يتم حذفها أثناء الـ build.

👌

### Recommended Tree Shaking Optimizations

#### A. Verify & Optimize Imports

**Current barrel files that may hinder tree shaking:**

```typescript
// src/landing/index.ts - Check if this re-exports everything
export { LandingPage } from './LandingPage';
export * from './sections'; // ⚠️ May import unused sections
```

**Fix - Use named exports only:**
```typescript
// src/landing/index.ts - Explicit exports only
export { LandingPage } from './LandingPage';
export { HeroSection } from './sections/Hero/HeroSection';
export { FeaturesSection } from './sections/Features/FeaturesSection';
// ... only export what's actually used
```

#### B. Optimize Third-Party Imports

```typescript
// ❌ Bad - Imports entire library
import * as _ from 'lodash';
import { format } from 'date-fns';

// ✅ Good - Import only needed functions
import { debounce, throttle } from 'lodash-es';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';

// For date-fns specifically, use subpath imports
import { format } from 'date-fns';
import { addDays } from 'date-fns/addDays';
```

**Check current imports in the codebase:**
```bash
# Find potential non-tree-shakeable imports
grep -r "from 'lodash'" src/
grep -r "from 'date-fns'" src/
grep -r "import \*" src/
```

#### C. Vite/Rollup Tree Shaking Configuration

```typescript
// vite.config.ts - Enhanced build config
export default defineConfig({
  build: {
    // Enable aggressive tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
    },
    // Ensure ES modules output
    modulePreload: {
      polyfill: false, // Modern browsers support modulepreload
    },
    // Rollup options for better tree shaking
    rollupOptions: {
      treeshake: {
        moduleSideEffects: 'no-external', // Only external deps with sideEffects
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false,
      },
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'query-vendor': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'ui-vendor': ['lucide-react', 'radix-ui', 'sonner', 'clsx', 'tailwind-merge'],
          'animation-vendor': ['gsap', '@gsap/react', 'motion'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'table-vendor': ['@tanstack/react-table'],
          'utils-vendor': ['axios', 'dompurify', 'uuid'],
        },
        // Optimize chunk naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|ttf|eot)$/.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          return `assets/[ext]/[name]-[hash].${ext}`;
        },
      },
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Source maps for debugging (disable in production)
    sourcemap: false,
    // Report compressed sizes
    reportCompressedSize: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      '@tanstack/react-query',
      'axios',
      'zod',
      'clsx',
      'tailwind-merge',
      'lucide-react',
    ],
    exclude: ['@gsap/react'], // GSAP handles its own optimization
  },
});
```

#### D. Remove Unused Code Patterns

```typescript
// ❌ Avoid - Dead code that bundler can't always remove
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}

// ✅ Better - Use import.meta.env (Vite replaces at build time)
if (import.meta.env.DEV) {
  console.log('Debug info');
}

// ❌ Avoid - Side effects in module scope
const heavyComputation = expensiveOperation();

// ✅ Better - Lazy initialization
const getHeavyComputation = () => expensiveOperation();
```

#### E. Component-Level Tree Shaking

```typescript
// src/features/books/components/Search.tsx
// ❌ Bad - Imports entire icons library
import { Search, Filter, X, ChevronDown } from 'lucide-react';

// ✅ Good - Import only used icons (lucide-react supports this)
import { Search, Filter, X, ChevronDown } from 'lucide-react';

// For libraries that don't support tree shaking well, use:
import SearchIcon from 'lucide-react/dist/esm/icons/search';
import FilterIcon from 'lucide-react/dist/esm/icons/filter';
// Or use a plugin:
```

```bash
npm install -D babel-plugin-transform-imports
```

```typescript
// babel.config.json (if using Babel) or vite config
{
  "plugins": [
    ["transform-imports", {
      "lucide-react": {
        "transform": "lucide-react/dist/esm/icons/${member}",
        "preventFullImport": true
      },
      "radix-ui": {
        "transform": "@radix-ui/react-${member}",
        "preventFullImport": true
      }
    }]
  ]
}
```

#### F. Audit Bundle Size

```bash
# Analyze bundle composition
npm run build
npx vite-bundle-analyzer dist

# Or use rollup-plugin-visualizer
npm install -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    // ... other plugins
  ]
});
```

---

## 3. Implementation Checklist

### Resource Hints
- [ ] Add `dns-prefetch` for API, CDN, analytics domains
- [ ] Expand `preconnect` to all critical third-party origins
- [ ] Implement `preload` for critical CSS, JS, fonts, hero image
- [ ] Add `prefetch` for likely next-page routes
- [ ] Implement Speculation Rules API for modern browsers
- [ ] Add programmatic prefetching based on user navigation patterns

### Tree Shaking
- [ ] Audit all barrel file exports (`index.ts` files)
- [ ] Replace namespace imports with named imports
- [ ] Configure `vite-plugin-preload` for automatic resource hints
- [ ] Set up manual chunk splitting for better caching
- [ ] Add `rollup-plugin-visualizer` for bundle analysis
- [ ] Configure Terser for production minification
- [ ] Verify no CommonJS imports in ES module codebase
- [ ] Optimize lucide-react and radix-ui imports

### Monitoring
- [ ] Set up bundle size CI checks
- [ ] Monitor Core Web Vitals (LCP, FID, CLS)
- [ ] Track resource hint effectiveness via Performance API
- [ ] A/B test prefetch strategies

---

## 4. Quick Wins (Immediate Implementation)

### 1. Enhanced index.html Resource Hints
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/book-wise.svg" />
  
  <!-- DNS Prefetch -->
  <link rel="dns-prefetch" href="https://api.bookwise.com" />
  <link rel="dns-prefetch" href="https://cdn.bookwise.com" />
  
  <!-- Preconnect (Critical) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preconnect" href="https://api.bookwise.com" />
  <link rel="preconnect" href="https://cdn.bookwise.com" crossorigin />
  
  <!-- Preload Critical Resources -->
  <link rel="preload" as="style" href="/assets/index-[hash].css" />
  <link rel="preload" as="font" type="font/woff2" crossorigin 
        href="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2" />
  <link rel="preload" as="image" type="image/webp" href="/images/hero-image.webp" />
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="BookWise - Your Digital Library" />
  <title>book-wise</title>
  
  <script>
    (function () {
      const theme = localStorage.getItem("theme") || "dark";
      document.documentElement.setAttribute("data-theme", theme);
    })();
  </script>
  
 ../../..
```

### 2. Install & Configure Vite Plugins
```bash
npm install -D vite-plugin-preload rollup-plugin-visualizer
```

### 3. Update vite.config.ts with Production Optimizations
(See complete config above in Section 2C)

---

## 5. Expected Impact

| Optimization | Expected Improvement |
|--------------|---------------------|
| DNS Prefetch | 50-300ms faster third-party requests |
| Preconnect | 100-500ms faster critical third-party connections |
| Preload (fonts/CSS) | 200-400ms faster LCP |
| Prefetch (routes) | Near-instant navigation for cached routes |
| Tree Shaking | 10-30% smaller JS bundles |
| Manual Chunks | Better caching, parallel downloads |
| Code Splitting | 40-60% smaller initial bundle |

---

## 6. Resources & References

- [MDN Resource Hints](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preconnect)
- [Web.dev Preload Critical Assets](https://web.dev/preload-critical-assets/)
- [Vite Build Optimization](https://vite.dev/guide/build.html)
- [Rollup Tree Shaking](https://rollupjs.org/guide/en/#tree-shaking)
- [Speculation Rules API](https://developer.chrome.com/docs/web-platform/navigation-speculation/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

*Report generated for BookWise project - June 2026*














zod => yup for less size

