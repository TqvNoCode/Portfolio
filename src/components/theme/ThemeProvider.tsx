import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (originElement?: HTMLElement | null) => void;
  setTheme: (theme: Theme, originElement?: HTMLElement | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'tqv-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  const isTransitioningRef = useRef<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = async (nextTheme: Theme, originElement?: HTMLElement | null) => {
    if (nextTheme === theme) return;
    if (isTransitioningRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check if View Transition API is supported and not reduced-motion
    const supportsViewTransition =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !prefersReducedMotion;

    if (!supportsViewTransition) {
      setThemeState(nextTheme);
      return;
    }

    try {
      isTransitioningRef.current = true;

      // Calculate origin coordinates for radial reveal
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (originElement && typeof originElement.getBoundingClientRect === 'function') {
        const rect = originElement.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      // Calculate the radius to cover the furthest corner of the viewport
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // Start view transition with synchronous DOM flush
      const transition = (document as unknown as {
        startViewTransition: (cb: () => void) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      }).startViewTransition(() => {
        flushSync(() => {
          setThemeState(nextTheme);
          document.documentElement.setAttribute('data-theme', nextTheme);
        });
      });

      await transition.ready;

      // Animate circular clip-path on the incoming theme layer
      const animation = document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${Math.ceil(endRadius)}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 480,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );

      await animation.finished;
    } catch {
      // Graceful fallback if anything in animation fails
      setThemeState(nextTheme);
    } finally {
      isTransitioningRef.current = false;
    }
  };

  const toggleTheme = (originElement?: HTMLElement | null) => {
    setTheme(theme === 'dark' ? 'light' : 'dark', originElement);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
