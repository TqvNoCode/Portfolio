# TQV — Personal Engineering Portfolio

> **"Building software. Exploring intelligence. Engineering ideas into reality."**

A distinctive, production-grade personal engineering portfolio for **TQV**, focusing on Software Development and Applied AI Engineering.

---

## 1. Project Architecture

The portfolio is architected as an **Engineering Lab**, emphasizing technical honesty, tooling depth, and system performance without superficial AI clichés or bloated frameworks.

```
my_portfolio/
├── .agents/skills/            # Project-local Agent Skills
│   ├── ui-ux-pro-max/         # UI/UX design intelligence & tokens
│   ├── frontend-design/       # Creative direction & distinctive aesthetic
│   ├── web-design-guidelines/ # Accessibility & interaction rules
│   └── react-best-practices/  # React 19 performance guidelines
├── public/
│   ├── _headers               # Cloudflare Pages security & caching headers
│   ├── _redirects             # Cloudflare Pages SPA rewrite rule (/* -> /index.html)
│   ├── favicon.svg            # Terminal vector favicon
│   ├── oneko.gif              # Pixel-art cat sprite sheet (3.3 KB)
│   ├── robots.txt             # Search engine crawl policy
│   └── sitemap.xml            # Canonical sitemap
├── src/
│   ├── components/
│   │   ├── Header/            # Sticky header, section tracking & Cmd+K trigger
│   │   ├── Hero/              # Identity, positioning & 3D Engineering Core
│   │   ├── hero3d/            # Three.js WebGL core scene & SVG Matrix fallback
│   │   ├── About/             # 3 Engineering pillars (Systems, AI, Architecture)
│   │   ├── ProjectShowcase/   # MathWeave Studio in-depth case study
│   │   ├── TechnicalArsenal/  # Categorized capability groups with semantic icons
│   │   ├── DotfilesExplorer/  # Dual-mode workstation specs, configs & CLI toolkit
│   │   ├── EngineeringNotes/  # Technical writings & packaging insights
│   │   ├── listening-room/    # YouTube Music deep-work focus stream
│   │   ├── oneko/             # 60 FPS GPU-accelerated companion cat
│   │   ├── theme/             # Radial circular View Transitions ThemeProvider
│   │   ├── Contact/           # Verified GitHub collaboration portal (sole channel)
│   │   ├── CommandPalette/    # Keyboard-accessible Cmd/Ctrl+K dialog
│   │   ├── Footer/            # Terminal status bar & system metadata
│   │   └── react-bits/        # DecryptedText & SpotlightCard components
│   ├── data/
│   │   ├── profile.ts         # Central profile & verified GitHub remotes
│   │   ├── projects.ts        # MathWeave Studio case study data
│   │   ├── skills.ts          # Technical capability inventory with icon mapping
│   │   ├── dotfiles.ts        # Sanitized Arch Linux configs & 14-tool CLI toolkit
│   │   ├── notes.ts           # Engineering articles & reflections
│   │   ├── listeningRoom.ts   # Audio stream configuration & safe URL parser
│   │   └── navigation.ts      # Navigation items & commands
│   ├── styles/
│   │   ├── tokens.css         # Single source of truth (Dark Lab + Light Blueprint)
│   │   ├── global.css         # Reset, focus rings, scrollbars & view transitions
│   │   └── typography.css     # Typography classes & heading hierarchy
│   ├── App.tsx                # Application root with skip links & keyboard bindings
│   ├── main.tsx               # Entry point with ThemeProvider wrapper
│   └── vite-env.d.ts          # Vite & CSS Modules declarations
├── reports/                   # Performance & acceptance sprint reports
│   ├── ENHANCEMENT_SPRINT_V2_REPORT.md
│   └── SPRINT_V3_PERFORMANCE_REPORT.md
├── DESIGN.md                  # Comprehensive Design Specification
└── package.json               # Dependencies (React 19, Vite, Three.js, Motion, Lucide)
```

---

## 2. Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6 (ESNext build target)
- **3D & Graphics**: Three.js (dynamic import with `React.lazy()` and WebGL detection)
- **Styling**: Modern CSS Modules & CSS Custom Properties (`tokens.css`) — *No Tailwind CSS*
- **Theme Engine**: Dual theme (Dark Lab & Editorial Blueprint) with radial circular reveal via `document.startViewTransition()` and Web Animations API
- **Animation**: Motion v12 (`motion/react`) + GPU-composited `transform: translate3d`
- **Icons**: Lucide React (tree-shakable named imports)
- **Selected Components**: React Bits (TypeScript + CSS variants of `SpotlightCard` and `DecryptedText`)
- **Hosting Target**: Cloudflare Pages

---

## 3. Local Development & Build

### Prerequisites
- Node.js `v20+` (tested on Node `v26.12.1`)
- npm `v10+`

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
Compiles TypeScript, processes assets, code-splits the Three.js 3D core into an independent lazy chunk, and outputs static production files to `dist/`.

### Local Preview
```bash
npm run preview
```

---

## 4. Key Engineering Features (Sprint V3)

### A. Radial Circular Theme Reveal
- Clicking the Sun/Moon toggle button calculates the exact coordinates `(x, y)` of the button and the hypotenuse distance to the furthest viewport corner.
- Uses `document.startViewTransition()` combined with the Web Animations API `clipPath: circle()` to expand the incoming theme across the viewport in 480ms.
- Includes automatic fallback for unsupported browsers and respects `prefers-reduced-motion: reduce`.

### B. High-Performance Oneko Cursor
- Decouples pointer tracking (`mousemove` passively updates coordinate refs) from rendering (60 FPS `requestAnimationFrame` with delta-time scaling).
- Retro sprite stepping (130ms cadence) is decoupled from physical trajectory movement.
- Uses `transform: translate3d(x, y, 0)` with `will-change: transform`, eliminating layout recalculation.
- Automatically pauses when the browser tab is hidden (`visibilitychange`) or when the user prefers reduced motion.

### C. Viewport-Aware 3D Engineering Core
- Multi-faceted icosahedron nucleus with wireframe lattice, dual precessing orbital rings, and a 260-particle tensor constellation.
- Monitored by `IntersectionObserver`: completely pauses the WebGL rendering loop when scrolled out of view.
- Frame-rate independent: all rotations and orbital precessions are scaled by clamped delta time (`dt`).
- Automatically falls back to the SVG Neural-Logic Matrix if WebGL is unavailable or reduced motion is active.

### D. Advanced Workstation Explorer
- **Environment Specs**: 8 verified cards covering Arch Linux, i3-gaps/X11, Kitty GPU, Zsh + Powerlevel10k, Neovim (lazy.nvim), Tmux + TPM, JetBrainsMono & MesloLGS NF, and GNU Stow.
- **Config Modules**: 7 authenticated configuration trees with live clipboard copy and direct GitHub source links.
- **CLI Toolkit**: 14 categorized command-line tools (*Terminal Utilities*, *Git Workflow*, *File Navigation*, *Development & Runtimes*, *System Management*) with exact shell commands and workflow impact rationales.

### E. Semantic Lucide Iconography
- Consistent stroke width and 16-20px sizing across Technical Arsenal skill cards, Workstation Explorer specs, CLI tools, and Engineering Notes.

---

## 5. Cloudflare Pages Deployment

### Option A: Automated Git Integration (Recommended)
1. Push this repository to GitHub: `https://github.com/TqvNoCode/my_portfolio`.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
3. Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
4. Select the repository and configure the build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
5. Click **Save and Deploy**. Cloudflare Pages will build and deploy the application with automated HTTPS.

### Option B: Direct Upload via Wrangler CLI
```bash
npm install -g wrangler
wrangler pages deploy dist --project-name=tqv-portfolio
```

> **Note on SPA Routing**: The project includes `public/_redirects` (`/* /index.html 200`) and `public/_headers`, ensuring all client-side navigation and deep linking work without 404 errors.

---

## 6. Security, Privacy & Verified Contact

- **Sole Public Channel**: All public communication, collaboration, and repository access occurs through verified GitHub channels:
  - **Primary Profile**: [@TqvNoCode](https://github.com/TqvNoCode)
  - **Dotfiles Repository**: [TqvNoCode/Arch](https://github.com/TqvNoCode/Arch)
  - **Featured Project**: [TqvNoCode/MathWeave-Studio](https://github.com/TqvNoCode/MathWeave-Studio)
- **Zero Email Harvesting**: Direct email addresses have been removed from public source files to prevent automated web scraper harvesting.
- **Sanitized Dotfiles**: All configurations represent verified public-safe snippets without internal credentials or private tokens.

---

## 7. Verification Checklist

- [x] Display name: **TQV**
- [x] Positioning: *Software Development + AI Engineering*
- [x] Brand statement: *"Building software. Exploring intelligence. Engineering ideas into reality."*
- [x] Featured Project: **MathWeave Studio** (verified PyInstaller specification, `uv` packaging, ODE solvers, Pytest).
- [x] Radial circular theme reveal with View Transitions API and Web Animations clip-path.
- [x] High-performance 60 FPS Oneko companion cat with GPU-composited `translate3d`.
- [x] Viewport-aware Three.js 3D Engineering Core with delta-time rotation and SVG matrix fallback.
- [x] Advanced Workstation Explorer with 8 Environment Specs, 7 Config Files, and 14 CLI Tools.
- [x] Semantic Lucide React icons integrated across all capability cards and sections.
- [x] YouTube Music Listening Room with safe URL parser and graceful empty state.
- [x] Command Palette: Fully keyboard-accessible (`⌘K` / `Ctrl+K`) with theme toggle action.
- [x] Production build passes with zero errors and clean code-split chunks.
- [x] Visual QA verified across desktop (1440px, 1280px) and mobile viewports.
