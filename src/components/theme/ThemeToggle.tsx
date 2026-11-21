import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleTheme(e.currentTarget);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.themeToggle} ${className}`}
      aria-label={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
      title={isDark ? 'Switch to Light theme (Blueprint mode)' : 'Switch to Dark theme (Engineering Lab mode)'}
    >
      <div className={styles.iconWrapper} aria-hidden="true">
        {isDark ? <Sun size={17} className={styles.sunIcon} /> : <Moon size={17} className={styles.moonIcon} />}
      </div>
      <span className={styles.srText}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};
