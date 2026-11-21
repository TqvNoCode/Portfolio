export interface EnvironmentSpec {
  label: string;
  value: string;
  badge: string;
  detail: string;
  iconName: string;
}

export interface DotfileEntry {
  id: string;
  category: string;
  name: string;
  tool: string;
  filePath: string;
  language: string;
  summary: string;
  whyChosen: string;
  codeSnippet: string;
  sourceUrl: string;
}

export interface CliTool {
  name: string;
  command: string;
  category: 'Terminal Utilities' | 'Git Workflow' | 'File & Buffer Navigation' | 'Development & Runtimes' | 'System Management';
  description: string;
  roleInWorkflow: string;
  iconName: string;
}

export const ENVIRONMENT_SPECS: EnvironmentSpec[] = [
  {
    label: 'Operating System',
    value: 'Arch Linux',
    badge: 'Rolling Release',
    detail: 'Minimalist base with Linux Zen/Vanilla kernel, optimized for developer latency.',
    iconName: 'Server',
  },
  {
    label: 'Window Manager',
    value: 'i3-gaps / X11',
    badge: 'Tiling WM',
    detail: 'Keyboard-driven window tiling with multi-monitor workspace tagging.',
    iconName: 'Layout',
  },
  {
    label: 'Terminal Emulator',
    value: 'Kitty GPU',
    badge: 'OpenGL Canvas',
    detail: 'Hardware-accelerated terminal with font ligature rendering and sub-millisecond input response.',
    iconName: 'Terminal',
  },
  {
    label: 'Shell & Prompt',
    value: 'Zsh + Powerlevel10k',
    badge: 'Instant Prompt',
    detail: 'Asynchronous prompt execution with zero typing delay on terminal open.',
    iconName: 'Command',
  },
  {
    label: 'Code Editor',
    value: 'Neovim (lazy.nvim)',
    badge: 'Modal Core',
    detail: 'LSP diagnostics via Mason, Treesitter syntax highlighting, and sub-35ms startup.',
    iconName: 'Code2',
  },
  {
    label: 'Multiplexer',
    value: 'Tmux + TPM',
    badge: 'Prefix Ctrl-A',
    detail: 'Persistent terminal session state with Catppuccin telemetry and path-aware splits.',
    iconName: 'Layers',
  },
  {
    label: 'Typography',
    value: 'JetBrainsMono NF',
    badge: 'Nerd Font Icons',
    detail: 'Paired with MesloLGS NF for Powerlevel10k shell icons and code readability.',
    iconName: 'Type',
  },
  {
    label: 'Symlink Management',
    value: 'GNU Stow',
    badge: 'Zero Pollution',
    detail: 'Maintains version-controlled ~/dotfiles mirrored to $HOME without manual symlinks.',
    iconName: 'FolderGit2',
  },
];

export const DOTFILES_DATA: DotfileEntry[] = [
  {
    id: 'kitty',
    category: 'Terminal',
    name: 'Kitty Terminal Config',
    tool: 'Kitty GPU Terminal Emulator',
    filePath: '~/dotfiles/kitty/.config/kitty/kitty.conf',
    language: 'conf',
    summary:
      'GPU-accelerated terminal configuration with custom font ligatures, transparent background with blur, and automated Tmux shell spawning.',
    whyChosen:
      'Kitty offloads rendering to the GPU, providing sub-millisecond input latency and flawless true-color (RGB) support essential for long coding sessions.',
    codeSnippet: `# Font configuration
font_family      JetBrainsMono Nerd Font
font_size        13.0
bold_font        auto
italic_font      auto

# Opacity & Window Aesthetics
background_opacity         0.88
dynamic_background_opacity yes
background_blur            50
hide_window_decorations    titlebar-only

# Window padding & ergonomics
window_padding_width 10
confirm_os_window_close 0

# Ligatures & Terminal Type
disable_ligatures never
term              xterm-256color

# Auto-launch tmux session on startup
shell tmux`,
    sourceUrl: 'https://github.com/TqvNoCode/Arch/blob/main/kitty/.config/kitty/kitty.conf',
  },
  {
    id: 'nvim',
    category: 'Editor',
    name: 'Neovim Core Init',
    tool: 'Neovim with lazy.nvim',
    filePath: '~/dotfiles/nvim/.config/nvim/init.lua',
    language: 'lua',
    summary:
      'Bootstrap loader for lazy.nvim plugin management, Mason LSP package manager, Treesitter, and modular configuration split.',
    whyChosen:
      'Neovim offers an unbeatable modal editing speed. Paired with lazy.nvim, LSPs start lazily, maintaining under 30ms startup time even with dozens of language tools.',
    codeSnippet: `-- Bootstrap lazy.nvim plugin manager
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.uv.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- Set leader key to Space
vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Load core options and helper modules
require("vim-options")
require("vim-helpers")
require("help-floating")

-- Setup plugin collection and snippets
require("lazy").setup("plugins")
require("snippets")`,
    sourceUrl: 'https://github.com/TqvNoCode/Arch/tree/main/nvim/.config/nvim',
  },
  {
    id: 'tmux',
    category: 'Multiplexer',
    name: 'Tmux Workflow Config',
    tool: 'Tmux Terminal Multiplexer',
    filePath: '~/dotfiles/tmux/.tmux.conf',
    language: 'tmux',
    summary:
      'Ergonomic terminal multiplexer setup with Ctrl-A prefix, Vim-style navigation, intuitive path-aware splits, and status bar integration.',
    whyChosen:
      'Rebinding the default prefix to Ctrl-A eliminates finger gymnastics, while path-preserving pane splits allow seamless parallel development.',
    codeSnippet: `# Terminal capabilities & true color
set -g default-terminal "screen-256color"
set -as terminal-features ",xterm-kitty:RGB"

# Responsive input delays
set -s escape-time 10
set -sg repeat-time 400
set -s focus-events on
set -g status-interval 10
set -g mouse on

# Base index starts at 1 for keyboard reach
set -g base-index 1
setw -g pane-base-index 1
set -g renumber-windows on

# Ergonomic Prefix: Ctrl-A
set -g prefix C-a
bind C-a send-prefix

# Intuitive splits at current path
unbind %
bind '\\' split-window -h -c '#{pane_current_path}'
unbind '"'
bind - split-window -v -c '#{pane_current_path}'

# Vim-style pane resizing (h, j, k, l)
bind -r j resize-pane -D 5
bind -r k resize-pane -U 5
bind -r h resize-pane -L 5
bind -r l resize-pane -R 5`,
    sourceUrl: 'https://github.com/TqvNoCode/Arch/blob/main/tmux/.tmux.conf',
  },
  {
    id: 'zsh',
    category: 'Shell',
    name: 'Zsh & Prompt Architecture',
    tool: 'Zsh + Oh-My-Zsh + Powerlevel10k',
    filePath: '~/dotfiles/zsh/.zshrc',
    language: 'zsh',
    summary:
      'High-speed interactive shell configuration with Powerlevel10k instant prompt, fzf-tab interactive auto-completion, and US layout enforcement.',
    whyChosen:
      'Instant prompt allows immediate typing before plugin initialization finishes, and fzf-tab transforms tab completion into an interactive fuzzy finder.',
    codeSnippet: `# Enable Powerlevel10k instant prompt for zero-latency startup
if [[ -r "\${XDG_CACHE_HOME:-\$HOME/.cache}/p10k-instant-prompt-\${(%):-%n}.zsh" ]]; then
  source "\${XDG_CACHE_HOME:-\$HOME/.cache}/p10k-instant-prompt-\${(%):-%n}.zsh"
fi

export ZSH="\$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"

# Curated plugin list
plugins=(
  git
  fzf-tab
  zsh-autosuggestions
  zsh-syntax-highlighting
)

source \$ZSH/oh-my-zsh.sh
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# Ensure US layout for terminal commands
if command -v fcitx5-remote &>/dev/null; then
  fcitx5-remote -s keyboard-us 2>/dev/null
fi

# fzf-tab visual configuration
zstyle ':fzf-tab:*' fzf-flags \\
  '--height=50%' \\
  '--layout=reverse' \\
  '--border=none' \\
  '--color=prompt:cyan,pointer:cyan,marker:yellow'`,
    sourceUrl: 'https://github.com/TqvNoCode/Arch/blob/main/zsh/.zshrc',
  },
  {
    id: 'alacritty',
    category: 'Terminal',
    name: 'Alacritty Fallback Profile',
    tool: 'Alacritty GPU Terminal',
    filePath: '~/dotfiles/alacritty/.config/alacritty/alacritty.toml',
    language: 'toml',
    summary:
      'Zero-overhead, pure Rust terminal emulator configuration for headless benchmarks and resource-constrained environments.',
    whyChosen:
      'Alacritty provides benchmark-grade raw throughput when testing high-volume log streams or running continuous ML batch outputs.',
    codeSnippet: `[window]
padding = { x = 12, y = 12 }
opacity = 0.92
blur = true
decorations = "None"

[font]
size = 12.5
normal = { family = "JetBrainsMono Nerd Font", style = "Regular" }
bold = { family = "JetBrainsMono Nerd Font", style = "Bold" }

[cursor]
style = { shape = "Beam", blinking = "On" }

[colors.primary]
background = "#0B1217"
foreground = "#E5EEF2"

[colors.normal]
black   = "#15232C"
red     = "#EF6A6A"
green   = "#86D5CE"
yellow  = "#E8B987"
blue    = "#314550"
magenta = "#C678DD"
cyan    = "#56B6C2"
white   = "#ABB2BF"`,
    sourceUrl: 'https://github.com/TqvNoCode/Arch',
  },
  {
    id: 'i3',
    category: 'Window Manager',
    name: 'i3-gaps Tiling Layout',
    tool: 'i3 Tiling Window Manager',
    filePath: '~/dotfiles/i3/.config/i3/config',
    language: 'conf',
    summary:
      'Keyboard-centric workspace distribution with gaps, floating rules for debuggers, and seamless terminal spawning.',
    whyChosen:
      'Eliminates mouse travel; every window is bound to explicit workspaces (Code, Web, Terminal, ML Monitor) with instant Super+[1-9] switching.',
    codeSnippet: `# i3-gaps layout definition
set $mod Mod4

# Font for window titles
font pango:JetBrainsMono Nerd Font 10

# Gaps configuration
gaps inner 8
gaps outer 2

# Smart borders & titlebars
default_border pixel 1
default_floating_border pixel 1
hide_edge_borders smart

# Application shortcuts
bindsym $mod+Return exec kitty
bindsym $mod+d exec --no-startup-id dmenu_run
bindsym $mod+Shift+q kill

# Workspace assignments
bindsym $mod+1 workspace 1: Code
bindsym $mod+2 workspace 2: Web
bindsym $mod+3 workspace 3: Term
bindsym $mod+4 workspace 4: ML/Tensors`,
    sourceUrl: 'https://github.com/TqvNoCode/Arch',
  },
  {
    id: 'stow',
    category: 'System',
    name: 'GNU Stow Symlink Management',
    tool: 'GNU Stow + Arch Linux Packaging',
    filePath: '~/dotfiles/README.md',
    language: 'bash',
    summary:
      'Symlink topology for managing configuration dotfiles across an Arch Linux workstation without manual copying or root pollution.',
    whyChosen:
      'GNU Stow maintains clean separation between repository source files and $HOME target symlinks, making dotfile backups version-controlled and zero-risk.',
    codeSnippet: `# Clone verified dotfiles
git clone https://github.com/TqvNoCode/Arch ~/dotfiles
cd ~/dotfiles

# Stow individual application trees
stow nvim
stow tmux
stow kitty
stow zsh

# Restow / update symlinks safely
# stow -R <package>
# stow -D <package>`,
    sourceUrl: 'https://github.com/TqvNoCode/Arch',
  },
];

export const CLI_TOOLKIT: CliTool[] = [
  {
    name: 'ripgrep',
    command: 'rg -S "pattern" src/',
    category: 'Terminal Utilities',
    description: 'Rust-powered regex search utility that respects .gitignore by default.',
    roleInWorkflow: 'Used within Neovim fzf-lua for live codebase grep and instant symbol lookups across large repositories.',
    iconName: 'Search',
  },
  {
    name: 'fzf',
    command: 'fzf --preview "bat --color=always {}"',
    category: 'Terminal Utilities',
    description: 'General-purpose command-line fuzzy finder with real-time file previewing.',
    roleInWorkflow: 'Powers terminal history lookup, fzf-tab Zsh completion, and file jump buffers in Neovim.',
    iconName: 'Filter',
  },
  {
    name: 'bat',
    command: 'bat --theme=base16 file.ts',
    category: 'Terminal Utilities',
    description: 'A cat clone with syntax highlighting and Git integration.',
    roleInWorkflow: 'Used as the default preview pager for fzf and terminal inspection without launching full editors.',
    iconName: 'FileText',
  },
  {
    name: 'eza',
    command: 'eza -la --icons --git',
    category: 'Terminal Utilities',
    description: 'Modern, maintained replacement for ls with color coding and Git status flags.',
    roleInWorkflow: 'Replaces ls in ~/.zshrc aliases for rapid directory inspection and file permissions checking.',
    iconName: 'FolderTree',
  },
  {
    name: 'lazygit',
    command: 'lazygit',
    category: 'Git Workflow',
    description: 'Simple terminal UI for git commands written in Go.',
    roleInWorkflow: 'Streamlines interactive commit staging, hunk inspection, and branch switching directly inside tmux panes.',
    iconName: 'GitBranch',
  },
  {
    name: 'gh',
    command: 'gh pr view / gh issue create',
    category: 'Git Workflow',
    description: 'GitHub official CLI tool for managing repositories and PRs from the terminal.',
    roleInWorkflow: 'Automates release tags, PR reviews, and remote branch cloning without leaving the terminal.',
    iconName: 'FolderGit2',
  },
  {
    name: 'zoxide',
    command: 'z <directory>',
    category: 'File & Buffer Navigation',
    description: 'Smarter cd command that learns your habits and jumps to frequent folders.',
    roleInWorkflow: 'Enables single-keyword jumps between deeply nested project directories across workspaces.',
    iconName: 'Zap',
  },
  {
    name: 'oil.nvim',
    command: ':Oil',
    category: 'File & Buffer Navigation',
    description: 'Neovim file manager that lets you edit your filesystem like a normal buffer.',
    roleInWorkflow: 'Renaming, creating, and moving files with standard Vim motions (d, y, p) directly inside Neovim.',
    iconName: 'FileCode2',
  },
  {
    name: 'uv',
    command: 'uv venv && uv pip install -r requirements.txt',
    category: 'Development & Runtimes',
    description: 'Extremely fast Python package and project manager written in Rust.',
    roleInWorkflow: 'Instantly creates isolated Python virtual environments for ML models, PyTorch experiments, and MathWeave algorithms.',
    iconName: 'Package',
  },
  {
    name: 'clangd / gcc',
    command: 'clangd --background-index',
    category: 'Development & Runtimes',
    description: 'LLVM C/C++ language server with background indexing and AST analysis.',
    roleInWorkflow: 'Used in Neovim for native C/C++ engine development and low-level numerical algorithms.',
    iconName: 'Cpu',
  },
  {
    name: 'debugpy / codelldb',
    command: 'nvim-dap',
    category: 'Development & Runtimes',
    description: 'Debug Adapter Protocol implementations for Python and native binaries.',
    roleInWorkflow: 'Enables interactive breakpoints, step debugging, and variable inspection inside Neovim via toggleterm.',
    iconName: 'Bug',
  },
  {
    name: 'pacman & yay',
    command: 'sudo pacman -S <pkg> / yay -S <aur-pkg>',
    category: 'System Management',
    description: 'Arch Linux official package manager and trusted AUR helper.',
    roleInWorkflow: 'Keeps the entire development stack on bleeding-edge rolling releases with verifiable cryptographic signatures.',
    iconName: 'Boxes',
  },
  {
    name: 'btop',
    command: 'btop',
    category: 'System Management',
    description: 'Resource monitor that shows usage and stats for processor, memory, disks, and network.',
    roleInWorkflow: 'Monitors CPU/GPU thread saturation and VRAM allocation during local machine learning inference sessions.',
    iconName: 'Activity',
  },
  {
    name: 'tmux-resurrect',
    command: 'Prefix + Ctrl-s (save) / Ctrl-r (restore)',
    category: 'System Management',
    description: 'Tmux plugin that restores continuous environment state across reboots.',
    roleInWorkflow: 'Preserves exact window and pane layouts across Arch workstation updates and kernel restarts.',
    iconName: 'RefreshCw',
  },
];
