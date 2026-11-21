import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ArrowRight,
  Terminal,
  Layers,
  Cpu,
  FolderGit2,
  X,
  Sun,
  Headphones,
  ShieldCheck,
} from 'lucide-react';
import { PROFILE } from '../../data/profile';
import { useTheme } from '../theme/ThemeProvider';
import styles from './CommandPalette.module.css';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ActionCommand {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  shortcut?: string;
  run: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();

  const navigateTo = (id: string) => {
    onClose();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const commands: ActionCommand[] = [
    {
      id: 'nav-hero',
      title: 'Navigate to Overview (Home)',
      category: 'Navigation',
      icon: <Terminal size={16} />,
      run: () => navigateTo('hero'),
    },
    {
      id: 'nav-about',
      title: 'View Engineering Philosophy & About',
      category: 'Navigation',
      icon: <Layers size={16} />,
      run: () => navigateTo('about'),
    },
    {
      id: 'nav-projects',
      title: 'Explore MathWeave Studio Case Study',
      category: 'Navigation',
      icon: <Cpu size={16} />,
      run: () => navigateTo('projects'),
    },
    {
      id: 'nav-arsenal',
      title: 'Inspect Technical Arsenal & Capabilities',
      category: 'Navigation',
      icon: <Layers size={16} />,
      run: () => navigateTo('arsenal'),
    },
    {
      id: 'nav-workstation',
      title: 'Explore Workstation & Dotfiles',
      category: 'Navigation',
      icon: <Terminal size={16} />,
      run: () => navigateTo('workstation'),
    },
    {
      id: 'nav-notes',
      title: 'Read Engineering Notes & Writing',
      category: 'Navigation',
      icon: <Layers size={16} />,
      run: () => navigateTo('notes'),
    },
    {
      id: 'nav-listening-room',
      title: 'Enter Listening Room (Audio Stream)',
      category: 'Navigation',
      icon: <Headphones size={16} />,
      run: () => navigateTo('listening-room'),
    },
    {
      id: 'nav-contact',
      title: 'Go to Verified Collaboration & Contact',
      category: 'Navigation',
      icon: <ShieldCheck size={16} />,
      run: () => navigateTo('contact'),
    },
    {
      id: 'action-theme',
      title: `Toggle Theme (Switch to ${theme === 'dark' ? 'Light Blueprint' : 'Dark Lab'} Mode)`,
      category: 'Theme',
      icon: <Sun size={16} />,
      run: () => {
        toggleTheme();
        setNotice(`Theme changed to ${theme === 'dark' ? 'Light' : 'Dark'} mode`);
        setTimeout(() => {
          setNotice(null);
          onClose();
        }, 600);
      },
    },
    {
      id: 'action-github',
      title: 'Open GitHub Profile (@TqvNoCode)',
      category: 'External',
      icon: <FolderGit2 size={16} />,
      run: () => {
        onClose();
        window.open(PROFILE.social.github, '_blank', 'noopener,noreferrer');
      },
    },
    {
      id: 'action-dotfiles',
      title: 'Open Arch Linux Dotfiles Repository (TqvNoCode/Arch)',
      category: 'External',
      icon: <FolderGit2 size={16} />,
      run: () => {
        onClose();
        window.open(PROFILE.social.dotfilesRepo, '_blank', 'noopener,noreferrer');
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    `${cmd.title} ${cmd.category}`.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setNotice(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].run();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Command Palette">
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className={styles.inputBar}>
          <Search size={18} className={styles.searchIcon} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Type a command or navigate to a section..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            aria-autocomplete="list"
            aria-controls="command-results-list"
          />
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close command palette"
          >
            <X size={16} />
          </button>
        </div>

        {/* Command List */}
        <div id="command-results-list" className={styles.commandList} role="listbox">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.commandItem} ${isSelected ? styles.commandItemSelected : ''}`}
                  onClick={() => cmd.run()}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={styles.commandIcon}>{cmd.icon}</div>
                  <div className={styles.commandBody}>
                    <span className={styles.commandTitle}>{cmd.title}</span>
                    <span className={styles.commandCategory}>{cmd.category}</span>
                  </div>
                  {isSelected && <ArrowRight size={14} className={styles.enterArrow} aria-hidden="true" />}
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>No matching commands found.</div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className={styles.paletteFooter}>
          <div className={styles.footerHints}>
            <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
            <span><kbd>↵</kbd> to select</span>
            <span><kbd>esc</kbd> to close</span>
          </div>
          {notice && <span className={styles.copiedFeedback}>{notice}</span>}
        </div>
      </div>
    </div>
  );
};
