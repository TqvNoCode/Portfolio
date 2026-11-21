import React, { useState, useEffect } from 'react';
import { Terminal, Command, Menu, X, ExternalLink } from 'lucide-react';
import { NAV_ITEMS } from '../../data/navigation';
import { PROFILE } from '../../data/profile';
import styles from './Header.module.css';

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    NAV_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`} role="banner">
      <div className={`container ${styles.headerContainer}`}>
        {/* Brand / Identity */}
        <a href="#hero" className={styles.brand} aria-label="TQV Engineering Portfolio Home">
          <div className={styles.brandIcon} aria-hidden="true">
            <Terminal size={18} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>{PROFILE.name}</span>
            <span className={styles.brandDivider}>/</span>
            <span className={styles.brandSub}>Lab</span>
          </div>
          <span className={styles.statusIndicator} title="Status: Active">
            <span className={styles.statusDot}></span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Action: Command Palette trigger & Mobile Menu button */}
        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className={styles.cmdButton}
            aria-label="Open Command Palette (Cmd + K or Ctrl + K)"
            title="Open Command Palette (Ctrl+K)"
          >
            <Command size={14} aria-hidden="true" />
            <span className={styles.cmdShortcut}>
              <kbd>⌘</kbd>
              <kbd>K</kbd>
            </span>
          </button>

          <a
            href={PROFILE.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
            aria-label="TQV GitHub Profile (opens in new tab)"
          >
            <span>GitHub</span>
            <ExternalLink size={12} aria-hidden="true" />
          </a>

          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer} role="dialog" aria-label="Mobile Navigation">
          <nav className={styles.mobileNav}>
            <ul className={styles.mobileNavList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`${styles.mobileNavLink} ${activeSection === item.id ? styles.mobileNavActive : ''}`}
                  >
                    <span>{item.label}</span>
                    <span className={styles.mobileNavArrow}>→</span>
                  </a>
                </li>
              ))}
              <li className={styles.mobileNavDivider}></li>
              <li>
                <a
                  href={PROFILE.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileNavExternal}
                >
                  <span>GitHub (@TqvNoCode)</span>
                  <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
