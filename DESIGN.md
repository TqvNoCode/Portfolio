# TQV Engineering Portfolio — Design Specification & System

## 1. Project Identity & Positioning
- **Display Name**: TQV
- **Primary Positioning**: Software Development + AI Engineering
- **Brand Statement**: "Building software. Exploring intelligence. Engineering ideas into reality."
- **Core Philosophy**: A developer who builds, experiments, and inspects real systems down to the metal and up to intelligent applications.
- **Tone**: Technical, restrained, focused, authentic, engineering lab.

---

## 2. Creative Direction: "Engineering Lab"
Inspired by:
- **Anil Paneru's Workstation Showcase** (`anilpaneru.com.np`) — authentic system transparency, tooling depth, and workflow honesty.
- **jstani7/portfolio** — clean engineering typography, keyboard-centric command palette, crisp information hierarchy.
- **DavidHDev/react-bits** — precise, purpose-driven UI micro-interactions without bloated 3D or visual noise.

### Anti-Generic AI Pattern Audit (Self-Critique)
Following guidance from the `frontend-design` and `ui-ux-pro-max` skills:
- ❌ **No generic purple/violet neon gradients** (`#8B5CF6`, `#6366F1`) — these immediately scream template.
- ❌ **No heavy glassmorphism** with blurry white backdrops that ruin contrast.
- ❌ **No fake telemetry or mock server charts** simulating fake CPU/RAM usage.
- ❌ **No floating random particles** or distracting canvas backgrounds.
- ❌ **No repetitive, identical rounded cards** with identical drop shadows.
- ❌ **No all-caps tracked-out eyebrow tags** on every single heading.
- ❌ **No arbitrary skill percentage bars** (e.g. "Python 92%").
- ✅ **Instead**: Architectural wireframe grids, authentic terminal aesthetics, genuine configuration files, rich editorial layout with asymmetrical balance, and one memorable hero signature: an interactive SVG **"System Circuit / Logic Core"** that reflects software compilation and neural tensors.

---

## 3. Design Tokens & Palette System

CSS Variables are the single source of truth (`src/styles/tokens.css`):

### Core Color Palette
| Token Name | CSS Variable | Hex | Role | Contrast Ratio vs Background |
|---|---|---|---|---|
| **Deep Ink** | `--color-bg-primary` | `#0B1217` | Canvas / primary background | Baseline |
| **Graphite** | `--color-bg-surface` | `#15232C` | Surface cards, code panes, toolbars | 1.4:1 (elevation) |
| **Steel Blue** | `--color-border-subtle` | `#314550` | Structural borders, grid lines, dividers | 3.2:1 (structural boundary) |
| **Mist White** | `--color-text-primary` | `#E5EEF2` | Headings, primary text, active status | 14.8:1 (WCAG AAA) |
| **Signal Mint** | `--color-accent-mint` | `#86D5CE` | Primary CTA, status indicators, active code | 11.2:1 (WCAG AAA) |
| **Warm Signal** | `--color-accent-warm` | `#E8B987` | Accent tags, architecture nodes, highlights | 11.5:1 (WCAG AAA) |
| **Muted Slate** | `--color-text-secondary` | `#889CA6` | Secondary body text, timestamps, metadata | 5.8:1 (WCAG AA) |
| **Deep Surface** | `--color-bg-deep` | `#080D11` | Inset terminal window, code block canvas | - |

### Typography Scale
- **Display / Headings**: `'Space Grotesk', system-ui, sans-serif`
  - Hero display: `clamp(2.75rem, 6vw, 4.5rem)`, weight `700`, line-height `1.1`
  - Section title: `clamp(1.75rem, 3.5vw, 2.5rem)`, weight `600`, line-height `1.2`
  - Card title: `1.25rem`, weight `600`, line-height `1.3`
- **Body Text**: `'Inter', system-ui, -apple-system, sans-serif`
  - Base body: `1rem` (`16px`), weight `400`, line-height `1.6`, max-width `68ch`
  - Lead body: `1.125rem`, weight `400`, line-height `1.65`
  - Small note: `0.875rem`, weight `400`, line-height `1.5`
- **Technical / Code / Labels**: `'IBM Plex Mono', 'JetBrains Mono', monospace`
  - Code blocks: `0.875rem` (`14px`), line-height `1.6`
  - Metadata pills / badges: `0.75rem` (`12px`), weight `500`, tracking `0.02em`

---

## 4. Information Architecture & Navigation

```
[ Top Header / Nav ]
  ├── Brand: TQV (with active status indicator)
  ├── Nav Links: Projects | Arsenal | Workstation | Notes | Contact
  ├── Command Palette Trigger: [ ⌘K ]
  └── Mobile Menu Toggle (accessible drawer)

[ Hero Section ]
  ├── Primary Positioning: Software Development & AI Engineering
  ├── Monospace Eyebrow: Location/Status: Arch Linux • Building Systems • Open for Collab
  ├── Display Title: "Building software. Exploring intelligence. Engineering ideas into reality."
  ├── Narrative Paragraph
  ├── Action Group: [ View Projects (Mint CTA) ] [ Explore Dotfiles ] [ GitHub (External) ]
  └── Hero Visual Signature: Interactive SVG "Neural-Logic Matrix"

[ About Section ]
  ├── Engineering Philosophy: "Understanding through building from first principles."
  └── Core Pillars:
      ├── 01. Systems & Tooling (Linux, Neovim, Tmux, Rust/C/Python)
      ├── 02. Algorithmic Intelligence (Applied ML, Math Models, ODE Solvers)
      └── 03. Architecture & Reliability (Clean Boundaries, Modular Code, Test Rigor)

[ Featured Project: MathWeave Studio ]
  ├── Case Study Hero: Name, Role, Verified Tech Stack (Python, uv, Pytest, PyInstaller, Linux desktop)
  ├── Architecture Diagram: Math parsing -> Symbolic/Numerical Solver -> Interactive Canvas
  ├── Engineering Decisions & Real Verification (Pytest suite, ODE solver audit)
  ├── Status Pill: Phase 1 Active MVP
  └── Verified Links: GitHub repo (TqvNoCode/MathWeave-Studio), Specs, Architecture docs

[ Technical Arsenal ]
  ├── Group 1: Programming Languages (Python, C/C++, TypeScript, Lua, Shell/Bash, SQL)
  ├── Group 2: Software Development & Web (React, Node.js, REST APIs, Modular CSS, Architecture)
  ├── Group 3: AI & Machine Learning (Applied ML, Numerical Computing, PyTorch, Mathematical Modeling)
  ├── Group 4: Systems & Infrastructure (Arch Linux, System Architecture, Git, Docker, Cloudflare)
  └── Group 5: Developer Tools & Workstation (Neovim, Tmux, Kitty, Zsh/p10k, GNU Stow, uv)

[ Workstation & Dotfiles Explorer ]
  ├── Subtitle: "Inside My Workstation — A closer look at the environment and tools I use to build software."
  ├── Two-Pane Desktop / Stacked Mobile Layout:
      ├── Category Selector (Kitty, Neovim, Tmux, Zsh, System/Stow)
      └── Code & Configuration Inspector:
          ├── Header: File path (`~/dotfiles/kitty/...`), verified tag, copy button, GitHub source link
          ├── Sanitized configuration snippet with syntax highlighting
          └── Engineering commentary: Why this tool was chosen and how it is tuned.

[ Engineering Notes ]
  ├── Note 1: "Building MathWeave: Packaging Python Applications for Linux Workstations"
  └── Note 2: "Terminal Ergonomics: Harmonizing Neovim, Tmux, and Kitty under Arch Linux"

[ Contact & Terminal Footer ]
  ├── Verified Socials: GitHub (`github.com/TqvNoCode`), Email, Profile config
  └── System status: "TQV // 2026 • Built with React, Vite & Modern CSS • Hosted on Cloudflare Pages"

[ Quick Command Palette (Cmd/Ctrl + K) ]
  ├── Real keyboard actions:
      ├── Navigate to sections (Hero, MathWeave, Arsenal, Workstation, Notes, Contact)
      ├── Copy GitHub profile link
      ├── Copy Email address
      ├── Toggle Dotfiles view
      └── Quick theme/info
```

---

## 5. Interaction & Accessibility Specification
Following `web-design-guidelines` and `react-best-practices`:
- **Keyboard Navigation**:
  - `Cmd+K` / `Ctrl+K` opens Command Palette. `Esc` closes it. Focus is trapped inside dialog.
  - Skip-to-content link at the top of DOM.
  - Visible `:focus-visible` rings with `--color-accent-mint` and 2px offset.
- **Copy Feedback**:
  - Dotfiles snippets and contact email feature accessible clipboard copy with `aria-live="polite"` feedback.
- **Motion & Reduced Motion**:
  - All animations respect `@media (prefers-reduced-motion: reduce)`.
  - Transitions strictly scoped to `transform` and `opacity` to avoid layout thrashing.
- **Mobile Responsiveness**:
  - Fluid breakpoints: 320px, 640px, 768px, 1024px, 1280px.
  - Touch targets minimum `44px × 44px`.
  - Zero horizontal overflow (`overflow-x: hidden`).
