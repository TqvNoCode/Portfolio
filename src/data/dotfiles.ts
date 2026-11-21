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

# Force Kitty to use MesloLGS Nerd Font icons for p10k
# symbol_map U+E000-U+E00D,U+E0A0-U+E0A2 MesloLGS NF

# Opacity & Window Aesthetics
background_opacity         0.85
dynamic_background_opacity yes
background_blur            50
hide_window_decorations    titlebar-only

# Window padding
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
