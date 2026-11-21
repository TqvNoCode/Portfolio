import React from 'react';
import { ArrowUp, Terminal } from 'lucide-react';
import { PROFILE } from '../../data/profile';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.footerContainer}`}>
        {/* Top Tier */}
        <div className={styles.footerTop}>
          <div className={styles.footerIdentity}>
            <div className={styles.brandRow}>
              <div className={styles.brandIcon} aria-hidden="true">
                <Terminal size={16} />
              </div>
              <span className={styles.brandTitle}>{PROFILE.name}</span>
              <span className={styles.brandTag}>Engineering Lab</span>
            </div>
            <p className={styles.brandMotto}>
              &ldquo;{PROFILE.tagline}&rdquo;
            </p>
          </div>

          <div className={styles.footerNavGroup}>
            <button
              type="button"
              onClick={scrollToTop}
              className={styles.backToTopBtn}
              aria-label="Scroll back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Status Line Divider */}
        <div className={styles.statusLine}>
          <div className={styles.statusItem}>
            <span className={styles.statusIndicator}></span>
            <span>SYSTEM: ARCH LINUX // X86_64</span>
          </div>
          <div className={styles.statusItem}>
            <span>EDITOR: NEOVIM (LAZYVIM)</span>
          </div>
          <div className={styles.statusItem}>
            <span>MULTIPLEXER: TMUX // 0xCA</span>
          </div>
          <div className={styles.statusItem}>
            <span>STACK: REACT + TS + VITE</span>
          </div>
        </div>

        {/* Bottom Tier: Credits and Cloudflare Readiness */}
        <div className={styles.footerBottom}>
          <div className={styles.copyrightText}>
            © {new Date().getFullYear()} TQV. All code and system configurations verified.
          </div>

          <div className={styles.footerMeta}>
            <span>Cloudflare Pages Deploy Ready</span>
            <span className={styles.metaDot}>•</span>
            <a
              href={PROFILE.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              GitHub (@TqvNoCode)
            </a>
            <span className={styles.metaDot}>•</span>
            <a
              href={PROFILE.social.dotfilesRepo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Dotfiles
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
