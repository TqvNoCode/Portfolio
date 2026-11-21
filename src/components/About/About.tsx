import React from 'react';
import { Terminal, Cpu, Layers, CheckCircle2 } from 'lucide-react';
import { PROFILE } from '../../data/profile';
import { SpotlightCard } from '../react-bits/SpotlightCard';
import styles from './About.module.css';

export const About: React.FC = () => {
  return (
    <section id="about" className={styles.aboutSection} aria-label="About TQV and Engineering Philosophy">
      <div className={`container ${styles.aboutContainer}`}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowPrefix}>//</span>
            <span>PHILOSOPHY &amp; APPROACH</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Building Systems From First Principles
          </h2>
          <p className={styles.sectionLead}>
            {PROFILE.aboutIntro}
          </p>
        </div>

        {/* Narrative & Pillars Grid */}
        <div className={styles.pillarsGrid}>
          {/* Pillar 1: Systems & Tooling */}
          <SpotlightCard className={styles.pillarCard} spotlightColor="rgba(134, 213, 206, 0.15)">
            <div className={styles.cardHeader}>
              <div className={`${styles.iconWrap} ${styles.iconMint}`}>
                <Terminal size={22} aria-hidden="true" />
              </div>
              <span className={styles.cardIndex}>01 / SYSTEMS</span>
            </div>
            <h3 className={styles.cardTitle}>Linux &amp; Deep Tooling</h3>
            <p className={styles.cardDesc}>
              A productive engineer understands their host environment. I treat the Linux operating system, the shell, and the editor not as mere conveniences, but as precision instruments. From Arch Linux administration to modal editing in Neovim and multiplexing with Tmux, my tools are configured for maximum speed and zero friction.
            </p>
            <div className={styles.cardFooter}>
              <span className="tech-tag tech-tag-mint">Arch Linux</span>
              <span className="tech-tag">Neovim</span>
              <span className="tech-tag">Tmux</span>
              <span className="tech-tag">GNU Stow</span>
            </div>
          </SpotlightCard>

          {/* Pillar 2: Applied AI & Math */}
          <SpotlightCard className={styles.pillarCard} spotlightColor="rgba(232, 185, 135, 0.15)">
            <div className={styles.cardHeader}>
              <div className={`${styles.iconWrap} ${styles.iconWarm}`}>
                <Cpu size={22} aria-hidden="true" />
              </div>
              <span className={styles.cardIndex}>02 / INTELLIGENCE</span>
            </div>
            <h3 className={styles.cardTitle}>Applied AI &amp; Numerical Math</h3>
            <p className={styles.cardDesc}>
              Machine intelligence is most impactful when grounded in mathematical rigor. I am drawn to exploring neural architectures, numerical ODE methods, and representation learning—not by treating models as magical black boxes, but by studying their loss surfaces, analytical foundations, and algorithmic constraints.
            </p>
            <div className={styles.cardFooter}>
              <span className="tech-tag tech-tag-warm">Applied ML</span>
              <span className="tech-tag">ODE Solvers</span>
              <span className="tech-tag">PyTorch</span>
              <span className="tech-tag">Numerical Analysis</span>
            </div>
          </SpotlightCard>

          {/* Pillar 3: Architecture & Verification */}
          <SpotlightCard className={styles.pillarCard} spotlightColor="rgba(134, 213, 206, 0.15)">
            <div className={styles.cardHeader}>
              <div className={`${styles.iconWrap} ${styles.iconSteel}`}>
                <Layers size={22} aria-hidden="true" />
              </div>
              <span className={styles.cardIndex}>03 / RELIABILITY</span>
            </div>
            <h3 className={styles.cardTitle}>Architecture &amp; Test Rigor</h3>
            <p className={styles.cardDesc}>
              Code should be predictable, maintainable, and verifiable. I favor strong separation of concerns, explicit contracts between layers, deterministic packaging via uv and lockfiles, and automated Pytest suites that catch boundary bugs before code reaches users.
            </p>
            <div className={styles.cardFooter}>
              <span className="tech-tag">Modular Design</span>
              <span className="tech-tag tech-tag-mint">Pytest Suites</span>
              <span className="tech-tag">uv Lockfiles</span>
              <span className="tech-tag">Clean Contracts</span>
            </div>
          </SpotlightCard>
        </div>

        {/* Engineering Ethos Callout Banner */}
        <div className={styles.ethosBanner}>
          <div className={styles.ethosIcon}>
            <CheckCircle2 size={24} className={styles.ethosCheck} />
          </div>
          <div className={styles.ethosText}>
            <h4 className={styles.ethosTitle}>Core Engineering Ethos</h4>
            <p className={styles.ethosQuote}>
              &ldquo;{PROFILE.aboutPhilosophy}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
