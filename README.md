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
│   ├── robots.txt             # Search engine crawl policy
│   └── sitemap.xml            # Canonical sitemap
├── src/
│   ├── components/
│   │   ├── Header/            # Sticky header, section tracking & Cmd+K trigger
│   │   ├── Hero/              # Identity, positioning & SVG Neural-Logic Matrix
│   │   ├── About/             # 3 Engineering pillars (Systems, AI, Architecture)
│   │   ├── ProjectShowcase/   # MathWeave Studio in-depth case study
│   │   ├── TechnicalArsenal/  # 5 categorized capability groups
│   │   ├── DotfilesExplorer/  # Interactive sanitized workstation inspector
│   │   ├── EngineeringNotes/  # Technical writings & packaging insights
│   │   ├── Contact/           # Verified communication channels & email copy
│   │   ├── CommandPalette/    # Keyboard-accessible Cmd/Ctrl+K dialog
│   │   ├── Footer/            # Terminal status bar & system metadata
│   │   └── react-bits/        # DecryptedText & SpotlightCard components
│   ├── data/
│   │   ├── profile.ts         # Central profile & social identity configuration
│   │   ├── projects.ts        # MathWeave Studio case study data
│   │   ├── skills.ts          # Technical capability inventory
│   │   ├── dotfiles.ts        # Sanitized Arch Linux configuration files
│   │   ├── notes.ts           # Engineering articles & reflections
│   │   └── navigation.ts      # Navigation items & commands
│   ├── styles/
│   │   ├── tokens.css         # Single source of truth for color, font & spacing
│   │   ├── global.css         # Reset, focus rings, scrollbars & reduced motion
│   │   └── typography.css     # Typography classes & heading hierarchy
│   ├── App.tsx                # Application root with skip links & keyboard bindings
│   ├── main.tsx               # Entry point
│   └── vite-env.d.ts          # Vite & CSS Modules declarations
├── DESIGN.md                  # Comprehensive Design Specification
└── package.json               # Dependencies (React 19, Vite, Motion, Lucide)
```

---

## 2. Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6 (ESNext build target)
- **Styling**: Modern CSS Modules & CSS Custom Properties (`tokens.css`) — *No Tailwind CSS*
- **Animation**: Motion v12 (`motion/react`)
- **Icons**: Lucide React
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
Outputs static assets to `dist/`.

### Local Preview
```bash
npm run preview
```

---

## 4. Cloudflare Pages Deployment

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

## 5. Custom Domain & GitHub Student Developer Pack

The user has the **GitHub Student Developer Pack**.

### Recommended Domain Options:
1. **`tqv.tech`** (via **.TECH Domains**): Free 1-year standard `.tech` registration through [GitHub Student Pack (.TECH)](https://get.tech/github-student-developer-pack).
2. **`tqv.software`** (via **Name.com**): Free 1-year registration from select TLDs through [Name.com Student Offer](https://www.name.com/partner/github-students).
3. **`tqv.me`** (via **Namecheap**): Free 1-year `.me` registration and SSL through [Namecheap Student Bundle](https://nc.me).
4. **`tqv.dev`** (Google Registry): Note that 3-letter `.dev` domains are typically categorized as short/premium ($12–$30/yr) and usually require direct registration rather than free 1-year promotions.

### Connecting Custom Domain to Cloudflare Pages:
1. In Cloudflare Pages, open your project → **Custom domains** → **Set up a custom domain**.
2. Enter your registered domain (e.g., `tqv.tech` or `tqv.software`).
3. If using Cloudflare DNS: Cloudflare will automatically add the `CNAME` pointing to `<project>.pages.dev`.
4. If using external DNS: Add a `CNAME` record in your registrar's DNS management:
   - Name: `@` (or subdomain)
   - Target: `<project>.pages.dev`
5. Cloudflare will automatically provision a free universal SSL/TLS certificate.

---

## 6. Security & Privacy Audit (Workstation / Dotfiles)

Before publishing, all configuration files underwent a privacy audit:
- [x] **No SSH authentication keys** (private or public) included.
- [x] **No API tokens, cookies, or secrets** present in code snippets.
- [x] **No private hostnames, IP addresses, or internal network paths** exposed.
- [x] All file paths in Dotfiles Explorer point to sanitized snippets representing real configurations from `https://github.com/TqvNoCode/Arch`.

---

## 7. Content Completion & Verification Checklist

- [x] Display name: **TQV**
- [x] Brand statement: *"Building software. Exploring intelligence. Engineering ideas into reality."*
- [x] Positioning: *Software Development + AI Engineering*
- [x] Featured Project: **MathWeave Studio** (verified with repository `TqvNoCode/MathWeave-Studio`, `uv` tooling, ODE solver audit, and Pytest verification).
- [x] Workstation Explorer: Real sanitized configs for Kitty, Neovim, Tmux, Zsh, and GNU Stow.
- [x] Contact: Verified GitHub `@TqvNoCode` and authenticated developer email.
- [x] Command Palette: Fully keyboard-accessible (`⌘K` / `Ctrl+K`).
- [x] Production build passes with zero errors.
- [x] Visual QA verified across desktop and mobile viewports.
