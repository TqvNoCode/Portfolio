import React from 'react';
import { ArrowDown, ExternalLink, Terminal, FolderGit2 } from 'lucide-react';
import { PROFILE } from '../../data/profile';
import DecryptedText from '../react-bits/DecryptedText';
import { HeroVisual } from './HeroVisual';
import styles from './Hero.module.css';

export const Hero: React.FC = () => {
  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWorkstation = () => {
    const el = document.getElementById('workstation');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className={styles.heroSection} aria-label="Personal Identity and Introduction">
      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.heroContent}>
          {/* Workstation & State pill */}
          <div className={styles.statusPill}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>
              <DecryptedText text={PROFILE.status.location} speed={30} maxIterations={6} animateOn="view" />
            </span>
            <span className={styles.statusSep}>•</span>
            <span className={styles.statusFocus}>{PROFILE.status.focus}</span>
          </div>

          {/* Primary Identity */}
          <h1 className={styles.heroTitle}>
            <span className={styles.nameLabel}>{PROFILE.name}</span>
            <span className={styles.roleSub}>
              Software Development <span className={styles.ampersand}>&amp;</span> AI Engineering
            </span>
          </h1>

          {/* Brand Statement */}
          <p className={styles.brandStatement}>
            &ldquo;{PROFILE.tagline}&rdquo;
          </p>

          {/* Narrative Summary */}
          <p className={styles.heroSummary}>
            {PROFILE.statement}
          </p>

          {/* Action CTAs */}
          <div className={styles.heroActions}>
            <button
              type="button"
              onClick={scrollToProjects}
              className={styles.ctaPrimary}
              aria-label="View Featured Engineering Projects"
            >
              <span>View Projects</span>
              <ArrowDown size={16} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={scrollToWorkstation}
              className={styles.ctaSecondary}
              aria-label="Explore Arch Linux Workstation and Dotfiles"
            >
              <Terminal size={16} aria-hidden="true" />
              <span>Explore Workstation</span>
            </button>

            <a
              href={PROFILE.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaGhost}
              aria-label="Visit TQV GitHub Profile (@TqvNoCode) in a new tab"
            >
              <FolderGit2 size={16} aria-hidden="true" />
              <span>GitHub</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>

          {/* Verified Technical Badges */}
          <div className={styles.metaStrip} aria-label="Core Engineering Environment">
            <span className={styles.metaLabel}>Verified Environment:</span>
            <span className="tech-tag tech-tag-mint">Arch Linux</span>
            <span className="tech-tag">Neovim (lazy.nvim)</span>
            <span className="tech-tag">Tmux</span>
            <span className="tech-tag">Python (uv)</span>
            <span className="tech-tag tech-tag-warm">Applied ML</span>
          </div>
        </div>

        {/* Visual Signature */}
        <div className={styles.visualCol}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
};
