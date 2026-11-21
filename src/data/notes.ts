export interface EngineeringNote {
  id: string;
  title: string;
  date: string;
  readingTime: string;
  tags: string[];
  excerpt: string;
  content: string[];
  iconName: string;
}

export const ENGINEERING_NOTES: EngineeringNote[] = [
  {
    id: 'python-linux-packaging',
    title: 'Packaging Python Applications for Linux Workstations: Lessons from MathWeave Studio',
    date: 'October 2026',
    readingTime: '4 min read',
    tags: ['Python', 'Linux', 'Packaging', 'uv', 'PyInstaller'],
    iconName: 'Package',
    excerpt:
      'How we achieved reproducible packaging, sub-second dependency installation, and clean desktop integration for a Python math suite on Arch Linux.',
    content: [
      'Distributing Python desktop applications across Linux systems frequently encounters two major friction points: dependency resolution drift and desktop integration impedance.',
      'During the development of MathWeave Studio, we transitioned from traditional requirements.txt to Astral’s uv package manager. The speed difference was transformative: cold dependency resolution dropped from several minutes to under 800 milliseconds, and lockfiles guaranteed deterministic builds.',
      'For distribution, we crafted a customized PyInstaller specification (`mathweave-studio.spec`) alongside a desktop entry file (`mathweave-studio.desktop`). By encapsulating entry points inside an automated `launch.sh` script, the application operates cleanly in user space without requiring system-level package contamination.',
    ],
  },
  {
    id: 'terminal-ergonomics',
    title: 'Terminal Ergonomics: Harmonizing Kitty, Tmux, and Neovim under Arch Linux',
    date: 'September 2026',
    readingTime: '5 min read',
    tags: ['Arch Linux', 'Neovim', 'Tmux', 'Kitty', 'Productivity'],
    iconName: 'Terminal',
    excerpt:
      'Designing a frictionless keyboard-centric development setup with sub-30ms editor startup, true-color pass-through, and unified navigation.',
    content: [
      'A developer’s editor and terminal are not separate tools; they are a continuous cognitive surface. Creating a setup that removes friction between pane navigation and code editing requires careful coordination.',
      'In our setup, Kitty serves as the GPU-accelerated terminal canvas, automatically bootstrapping Tmux on launch. By mapping Tmux’s prefix to `Ctrl-A` and aligning split shortcuts to intuitive path-preserving keys (`\\` for vertical, `-` for horizontal), context-switching overhead vanishes.',
      'Within Neovim, lazy.nvim ensures that heavy LSP servers like Pyright and clangd only spin up when their corresponding file types are accessed, keeping editor bootstrap times below 30ms on Arch Linux.',
    ],
  },
];
