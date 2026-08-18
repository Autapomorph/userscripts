# Userscripts

Collection of high-quality Userscripts written in **TypeScript** for Tampermonkey, Violentmonkey, and Greasemonkey.

---

## 📜 Available Userscripts

| Userscript                        | Description                                                                                | Version |                                               Quick Install 🚀                                                |
| :-------------------------------- | :----------------------------------------------------------------------------------------- | :-----: | :-----------------------------------------------------------------------------------------------------------: |
| **Avoid Steam "Oops, Sorry!"**    | Redirects to target page avoiding Steam "Oops, Sorry!" age/region check error pages.       | `1.0.1` | [Install](https://github.com/Autapomorph/userscripts/releases/latest/download/avoid-steam-oops-sorry.user.js) |
| **Yandex to DuckDuckGo**          | Adds a DuckDuckGo search button directly into Yandex search results.                       | `2.1.3` |       [Install](https://github.com/Autapomorph/userscripts/releases/latest/download/yandex-ddg.user.js)       |
| **PH localStorage Auto Populate** | Disables autoplay, sets quality to 1080p, and mutes volume via localStorage.               | `1.2.1` |    [Install](https://github.com/Autapomorph/userscripts/releases/latest/download/ph-localstorage.user.js)     |

---

## 🛠️ Development & Building

This repository uses **TypeScript** and **esbuild** for fast bundling.

### 1. Install Dependencies

```bash
npm install
```

### 2. Watch Mode (Development)

Rebuilds `.user.js` files in `dist/` automatically on every source edit:

```bash
npm run dev
```

### 3. Build Production Bundles

Builds all Userscripts from `src/*.ts` into `dist/*.user.js` and auto-injects metadata headers:

```bash
npm run build
```

### 4. Code Quality & Testing

- **Type Checking**: `npm run typecheck`
- **Linting**: `npm run lint`
- **Unit Tests**: `npm test`
- **Coverage**: `npm run test:coverage`

---

## 🚀 Automated Release Workflow

Building and release publishing is handled automatically by GitHub Actions:

- On every `git push` to `main` or Pull Request, CI runs typecheck, linting, tests, and build verification.
- Publishing a new release (or git tag `v*`) automatically triggers the Release Workflow, building all Userscripts and attaching `.user.js` files directly to GitHub Release assets.

---

## 📄 License

[MIT](LICENSE) © Autapomorph
