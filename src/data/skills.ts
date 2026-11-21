export interface SkillItem {
  name: string;
  tag: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  iconName: string;
  summary: string;
  skills: SkillItem[];
}

export const TECHNICAL_ARSENAL: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    iconName: 'Code',
    summary: 'Core languages used for systems programming, data pipelines, application logic, and scripting.',
    skills: [
      {
        name: 'Python',
        tag: 'Primary',
        description: 'Mathematical computing, application backbones, scripting, uv tooling, and Pytest suites.',
      },
      {
        name: 'C / C++',
        tag: 'Systems',
        description: 'Systems programming fundamentals, clangd LSP workflows, and memory management understanding.',
      },
      {
        name: 'TypeScript / JavaScript',
        tag: 'Web & Tools',
        description: 'Modern frontend engineering, component systems, typed APIs, and tooling scripts.',
      },
      {
        name: 'Lua',
        tag: 'Config & Ext',
        description: 'Neovim configuration architecture, plugin customization, and embedded automation.',
      },
      {
        name: 'Shell (Bash & Zsh)',
        tag: 'Automation',
        description: 'System automation, dotfiles orchestration, tmux helpers, and workstation maintenance.',
      },
      {
        name: 'SQL',
        tag: 'Data',
        description: 'Relational data modeling, query optimization, and structured persistence.',
      },
    ],
  },
  {
    id: 'software-dev',
    title: 'Software Development & Architecture',
    iconName: 'Layers',
    summary: 'Designing modular, maintainable software architectures with high quality and predictable behavior.',
    skills: [
      {
        name: 'System Architecture',
        tag: 'Core',
        description: 'Separation of concerns, clean module interfaces, and layered calculation pipelines.',
      },
      {
        name: 'Frontend & UI Engineering',
        tag: 'Interface',
        description: 'Accessible, responsive interface development using React, Vite, and modern CSS variables.',
      },
      {
        name: 'REST & API Design',
        tag: 'Protocols',
        description: 'Predictable contract design, schema verification, and decoupled service layers.',
      },
      {
        name: 'Test-Driven Verification',
        tag: 'Rigor',
        description: 'Pytest test suites, edge-case coverage, and regression prevention before feature landing.',
      },
      {
        name: 'Modular CSS & Design Tokens',
        tag: 'Styling',
        description: 'Token-driven visual systems without bloated dependencies or arbitrary styling.',
      },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    iconName: 'Cpu',
    summary: 'Applying machine intelligence, numerical computation, and mathematical models to practical challenges.',
    skills: [
      {
        name: 'Applied Machine Learning',
        tag: 'Intelligence',
        description: 'Investigating neural network architectures, representation learning, and practical inference.',
      },
      {
        name: 'Numerical & Mathematical Computing',
        tag: 'Math',
        description: 'Differential equations (ODE), coordinate transformations, and matrix computations.',
      },
      {
        name: 'PyTorch Ecosystem',
        tag: 'Framework',
        description: 'Tensor computations, gradient pipelines, model evaluation, and experimentation.',
      },
      {
        name: 'Data Processing Pipelines',
        tag: 'Data',
        description: 'Data transformation, feature structuring, and repeatable evaluation methodology.',
      },
    ],
  },
  {
    id: 'systems-infra',
    title: 'Systems & Infrastructure',
    iconName: 'Server',
    summary: 'Operating system mastery, environment reproducible setups, and distributed deployment platforms.',
    skills: [
      {
        name: 'Arch Linux',
        tag: 'OS',
        description: 'Rolling-release Linux administration, pacman/yay package workflows, and kernel parameters.',
      },
      {
        name: 'Linux System Utilities',
        tag: 'Internals',
        description: 'Systemd services, power management tuning (TLP/powertop), process management, and POSIX tools.',
      },
      {
        name: 'Git & GNU Stow',
        tag: 'VCS & Config',
        description: 'Atomic commits, rebase workflows, symlink farm dotfiles management across repositories.',
      },
      {
        name: 'Cloudflare Pages & DNS',
        tag: 'Deployment',
        description: 'Edge-based static hosting, custom domain orchestration, security headers, and caching.',
      },
      {
        name: 'Docker Containers',
        tag: 'Environments',
        description: 'Isolated application packaging, containerized development, and reproducible build targets.',
      },
    ],
  },
  {
    id: 'dev-tools',
    title: 'Developer Tools & Workstation',
    iconName: 'Terminal',
    summary: 'A fast, ergonomic, terminal-centric development workflow built for productivity and focus.',
    skills: [
      {
        name: 'Neovim (LazyVim)',
        tag: 'Editor',
        description: 'Keyboard-centric editor with Mason LSP, Treesitter highlighting, and fzf-lua search.',
      },
      {
        name: 'Tmux Multiplexer',
        tag: 'Terminal',
        description: 'Persistent sessions, custom split binds, session resurrect, and status instrumentation.',
      },
      {
        name: 'Kitty GPU Terminal',
        tag: 'Shell UI',
        description: 'GPU-rendered terminal with custom ligatures, true-color rendering, and auto-tmux startup.',
      },
      {
        name: 'Zsh & Powerlevel10k',
        tag: 'Shell',
        description: 'Instant prompt configuration, fzf-tab interactive completion, and custom alias workflows.',
      },
      {
        name: 'uv & Python Tooling',
        tag: 'Packaging',
        description: 'Next-generation Python package management, fast dependency resolution, and virtualenv handling.',
      },
    ],
  },
];
