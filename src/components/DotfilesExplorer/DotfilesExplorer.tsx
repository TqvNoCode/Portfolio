import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FileCode,
  FolderGit2,
} from 'lucide-react';
import { DOTFILES_DATA, DotfileEntry } from '../../data/dotfiles';
import { PROFILE } from '../../data/profile';
import styles from './DotfilesExplorer.module.css';

export const DotfilesExplorer: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(DOTFILES_DATA[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const activeEntry: DotfileEntry =
    DOTFILES_DATA.find((entry) => entry.id === activeId) || DOTFILES_DATA[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeEntry.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy configuration', err);
    }
  };

  const lines = activeEntry.codeSnippet.split('\n');

  return (
    <section id="workstation" className={styles.workstationSection} aria-label="Inside My Workstation and Dotfiles">
      <div className={`container ${styles.workstationContainer}`}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowPrefix}>//</span>
            <span>WORKSTATION &amp; DOTFILES</span>
          </div>
          <div className={styles.headerFlex}>
            <div>
              <h2 className={styles.sectionTitle}>Inside My Workstation</h2>
              <p className={styles.sectionSubtitle}>
                A closer look at the environment, tools, and configurations I use to build software every day on Arch Linux.
              </p>
            </div>
            <div className={styles.privacyBadge} title="All configurations sanitized and safe">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>Sanitized &amp; Public Safe</span>
            </div>
          </div>
        </div>

        {/* Explorer Two-Panel Layout */}
        <div className={styles.explorerCard}>
          {/* Left Panel: Category / Tool Selector */}
          <div className={styles.selectorCol} role="tablist" aria-label="Workstation Tools">
            <div className={styles.selectorHeader}>
              <Terminal size={14} aria-hidden="true" />
              <span>Configured Tools</span>
            </div>

            <div className={styles.toolList}>
              {DOTFILES_DATA.map((entry) => {
                const isSelected = entry.id === activeId;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setActiveId(entry.id);
                      setCopied(false);
                    }}
                    className={`${styles.toolBtn} ${isSelected ? styles.toolBtnActive : ''}`}
                  >
                    <div className={styles.toolBtnTop}>
                      <span className={styles.toolName}>{entry.name}</span>
                      <span className="tech-tag tech-tag-mint">{entry.category}</span>
                    </div>
                    <span className={styles.toolPath}>{entry.filePath}</span>
                  </button>
                );
              })}
            </div>

            {/* Public Dotfiles Repository Link */}
            <div className={styles.repoFooter}>
              <a
                href={PROFILE.social.dotfilesRepo}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.dotfilesRepoLink}
                aria-label="View complete Arch Linux dotfiles repository on GitHub"
              >
                <FolderGit2 size={16} aria-hidden="true" />
                <span>View Full Dotfiles (TqvNoCode/Arch)</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Panel: Code Inspector */}
          <div className={styles.inspectorCol} role="tabpanel" aria-label={activeEntry.name}>
            {/* Inspector Topbar */}
            <div className={styles.inspectorBar}>
              <div className={styles.fileMetadata}>
                <FileCode size={16} className={styles.fileIcon} aria-hidden="true" />
                <span className={styles.activeFilePath}>{activeEntry.filePath}</span>
                <span className="tech-tag">{activeEntry.language}</span>
              </div>

              <div className={styles.inspectorActions}>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`${styles.actionBtn} ${copied ? styles.actionBtnCopied : ''}`}
                  aria-label={copied ? 'Configuration copied to clipboard' : 'Copy configuration snippet to clipboard'}
                >
                  {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  <span>{copied ? 'Copied' : 'Copy Config'}</span>
                </button>

                <a
                  href={activeEntry.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionBtn}
                  aria-label="View source file on GitHub (opens in new tab)"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  <span>Source</span>
                </a>
              </div>
            </div>

            {/* Commentary Banner */}
            <div className={styles.commentaryBanner}>
              <div className={styles.commentaryItem}>
                <span className={styles.commentaryLabel}>Tool:</span>
                <span className={styles.commentaryValue}>{activeEntry.tool}</span>
              </div>
              <div className={styles.commentaryItem}>
                <span className={styles.commentaryLabel}>Rationale:</span>
                <span className={styles.commentaryValue}>{activeEntry.whyChosen}</span>
              </div>
            </div>

            {/* Code Body with Line Numbers */}
            <div className={styles.codeViewport}>
              <pre className={styles.preCode}>
                <code>
                  {lines.map((line, idx) => (
                    <div key={idx} className={styles.codeLine}>
                      <span className={styles.lineNumber}>{idx + 1}</span>
                      <span className={styles.lineContent}>{line || ' '}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Live polite feedback for screen readers */}
            <div className="sr-only" aria-live="polite">
              {copied ? 'Configuration snippet copied to clipboard.' : ''}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
