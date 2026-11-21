import React from 'react';
import { FolderGit2, ExternalLink, ShieldCheck, Terminal, GitPullRequest, Code2 } from 'lucide-react';
import { PROFILE } from '../../data/profile';
import { SpotlightCard } from '../react-bits/SpotlightCard';
import styles from './Contact.module.css';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className={styles.contactSection} aria-label="Verified GitHub & Collaboration Portal">
      <div className={`container ${styles.contactContainer}`}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowPrefix}>//</span>
            <span>VERIFIED CHANNELS &amp; REPOSITORIES</span>
          </div>
          <h2 className={styles.sectionTitle}>Connect &amp; Collaborate</h2>
          <p className={styles.sectionLead}>
            All public engineering discussions, pull requests, and software contributions are conducted openly via GitHub.
            Explore verified source code, discuss systems architecture, or collaborate on applied AI implementations.
          </p>
        </div>

        {/* Channels Grid */}
        <div className={styles.channelsGrid}>
          {/* GitHub Primary Profile Card */}
          <SpotlightCard className={styles.channelCard} spotlightColor="rgba(134, 213, 206, 0.15)">
            <div className={styles.channelTop}>
              <div className={styles.channelIconWrap}>
                <FolderGit2 size={24} className={styles.mintIcon} aria-hidden="true" />
              </div>
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={13} aria-hidden="true" />
                <span>Verified Remotes</span>
              </span>
            </div>

            <div className={styles.channelBody}>
              <span className={styles.channelLabel}>Primary GitHub Identity</span>
              <h3 className={styles.channelHandle}>@TqvNoCode</h3>
              <p className={styles.channelBio}>
                Home of open-source projects including MathWeave Studio, systems experiments, and numerical computing pipelines.
              </p>
            </div>

            <div className={styles.channelActions}>
              <a
                href={PROFILE.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryActionBtn}
                aria-label="Visit TQV GitHub profile (@TqvNoCode) in a new tab"
              >
                <span>Visit GitHub Profile</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
              <a
                href={`${PROFILE.social.github}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryActionBtn}
                aria-label="Browse public repositories on GitHub"
              >
                <Code2 size={14} aria-hidden="true" />
                <span>Browse Repos</span>
              </a>
            </div>
          </SpotlightCard>

          {/* Dotfiles & Workstation Remote Card */}
          <SpotlightCard className={styles.channelCard} spotlightColor="rgba(232, 185, 135, 0.15)">
            <div className={styles.channelTop}>
              <div className={styles.channelIconWrap}>
                <Terminal size={24} className={styles.warmIcon} aria-hidden="true" />
              </div>
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={13} aria-hidden="true" />
                <span>Arch Linux Environment</span>
              </span>
            </div>

            <div className={styles.channelBody}>
              <span className={styles.channelLabel}>Workstation Architecture</span>
              <h3 className={styles.channelHandle}>TqvNoCode/Arch</h3>
              <p className={styles.channelBio}>
                Production dotfiles configuration for Neovim (lazy.nvim), Tmux, Kitty, Powerlevel10k, and GNU Stow symlinks.
              </p>
            </div>

            <div className={styles.channelActions}>
              <a
                href={PROFILE.social.dotfilesRepo}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryActionBtn}
                aria-label="Explore Arch dotfiles repository on GitHub"
              >
                <span>Inspect Dotfiles Repo</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
              <a
                href={`${PROFILE.social.dotfilesRepo}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryActionBtn}
                aria-label="Open discussion or issue on Arch dotfiles"
              >
                <GitPullRequest size={14} aria-hidden="true" />
                <span>Discussions / Issues</span>
              </a>
            </div>
          </SpotlightCard>
        </div>

        {/* Verification Note */}
        <div className={styles.verificationNote}>
          <ShieldCheck size={18} className={styles.shieldIcon} aria-hidden="true" />
          <span>
            Identity and code remotes authenticated under user <code>TqvNoCode</code>. All public communication and collaboration occurs directly via GitHub repositories and issues.
          </span>
        </div>
      </div>
    </section>
  );
};
