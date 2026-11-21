import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FileCode,
  FolderGit2,
  Wrench,
  Server,
  Layout,
  Command,
  Code2,
  Layers,
  Type,
  Search,
  Filter,
  FileText,
  FolderTree,
  GitBranch,
  Zap,
  FileCode2,
  Package,
  Cpu,
  Bug,
  Boxes,
  Activity,
  RefreshCw,
} from 'lucide-react';
import {
  DOTFILES_DATA,
  ENVIRONMENT_SPECS,
  CLI_TOOLKIT,
  DotfileEntry,
} from '../../data/dotfiles';
import { PROFILE } from '../../data/profile';
import styles from './DotfilesExplorer.module.css';

type ExplorerViewMode = 'configs' | 'toolkit';

const SPEC_ICON_MAP: Record<string, React.ReactNode> = {
  Server: <Server size={16} aria-hidden="true" />,
  Layout: <Layout size={16} aria-hidden="true" />,
  Terminal: <Terminal size={16} aria-hidden="true" />,
  Command: <Command size={16} aria-hidden="true" />,
  Code2: <Code2 size={16} aria-hidden="true" />,
  Layers: <Layers size={16} aria-hidden="true" />,
  Type: <Type size={16} aria-hidden="true" />,
  FolderGit2: <FolderGit2 size={16} aria-hidden="true" />,
};

const CLI_ICON_MAP: Record<string, React.ReactNode> = {
  Search: <Search size={16} aria-hidden="true" />,
  Filter: <Filter size={16} aria-hidden="true" />,
  FileText: <FileText size={16} aria-hidden="true" />,
  FolderTree: <FolderTree size={16} aria-hidden="true" />,
  GitBranch: <GitBranch size={16} aria-hidden="true" />,
  FolderGit2: <FolderGit2 size={16} aria-hidden="true" />,
  Zap: <Zap size={16} aria-hidden="true" />,
  FileCode2: <FileCode2 size={16} aria-hidden="true" />,
  Package: <Package size={16} aria-hidden="true" />,
  Cpu: <Cpu size={16} aria-hidden="true" />,
  Bug: <Bug size={16} aria-hidden="true" />,
  Boxes: <Boxes size={16} aria-hidden="true" />,
  Activity: <Activity size={16} aria-hidden="true" />,
  RefreshCw: <RefreshCw size={16} aria-hidden="true" />,
};

export const DotfilesExplorer: React.FC = () => {
  const [viewMode, setViewMode] = useState<ExplorerViewMode>('configs');
  const [activeId, setActiveId] = useState<string>(DOTFILES_DATA[0].id);
  const [cliCategoryFilter, setCliCategoryFilter] = useState<string>('All');
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

  const cliCategories = ['All', 'Terminal Utilities', 'Git Workflow', 'File & Buffer Navigation', 'Development & Runtimes', 'System Management'];

  const filteredCliTools =
    cliCategoryFilter === 'All'
      ? CLI_TOOLKIT
      : CLI_TOOLKIT.filter((tool) => tool.category === cliCategoryFilter);

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
                A deep look at the hardware configuration, keyboard-driven Linux environment, and command-line tools I use to engineer systems.
              </p>
            </div>
            <div className={styles.privacyBadge} title="All configurations sanitized and safe">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>Sanitized &amp; Public Safe</span>
            </div>
          </div>
        </div>

        {/* Environment Overview Specs Grid */}
        <div className={styles.specsOverviewGrid} aria-label="Workstation Hardware and OS Specifications">
          {ENVIRONMENT_SPECS.map((spec) => {
            const specIcon = SPEC_ICON_MAP[spec.iconName] || <Server size={16} />;
            return (
              <div key={spec.label} className={styles.specCard}>
                <div className={styles.specHeader}>
                  <div className={styles.specHeaderLeft}>
                    <div className={styles.specIconWrap} aria-hidden="true">
                      {specIcon}
                    </div>
                    <span className={styles.specLabel}>{spec.label}</span>
                  </div>
                  <span className={styles.specBadge}>{spec.badge}</span>
                </div>
                <div className={styles.specValue}>{spec.value}</div>
                <div className={styles.specDetail}>{spec.detail}</div>
              </div>
            );
          })}
        </div>

        {/* Mode Switcher */}
        <div className={styles.modeSwitchBar} role="tablist" aria-label="Workstation Sections">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'configs'}
            onClick={() => setViewMode('configs')}
            className={`${styles.modeBtn} ${viewMode === 'configs' ? styles.modeBtnActive : ''}`}
          >
            <FileCode size={16} aria-hidden="true" />
            <span>Configuration Files ({DOTFILES_DATA.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'toolkit'}
            onClick={() => setViewMode('toolkit')}
            className={`${styles.modeBtn} ${viewMode === 'toolkit' ? styles.modeBtnActive : ''}`}
          >
            <Wrench size={16} aria-hidden="true" />
            <span>CLI Toolkit ({CLI_TOOLKIT.length})</span>
          </button>
        </div>

        {/* VIEW 1: Configuration Explorer */}
        {viewMode === 'configs' && (
          <div className={styles.explorerCard}>
            {/* Left Panel: Tool Selector */}
            <div className={styles.selectorCol} role="tablist" aria-label="Configuration Files">
              <div className={styles.selectorHeader}>
                <Terminal size={14} aria-hidden="true" />
                <span>Dotfile Modules</span>
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
                  <span>View Full Repo (TqvNoCode/Arch)</span>
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
        )}

        {/* VIEW 2: CLI Toolkit Explorer */}
        {viewMode === 'toolkit' && (
          <div className={styles.toolkitContainer}>
            {/* Category Filter Pills */}
            <div className={styles.filterPillsBar} role="tablist" aria-label="CLI Tool Categories">
              {cliCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCliCategoryFilter(cat)}
                  className={`${styles.filterPill} ${cliCategoryFilter === cat ? styles.filterPillActive : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tools Grid */}
            <div className={styles.toolkitGrid}>
              {filteredCliTools.map((tool) => {
                const toolIcon = CLI_ICON_MAP[tool.iconName] || <Wrench size={16} />;
                return (
                  <div key={tool.name} className={styles.toolkitCard}>
                    <div className={styles.toolkitCardHeader}>
                      <div className={styles.toolIdentity}>
                        <div className={styles.cliMiniIcon} aria-hidden="true">
                          {toolIcon}
                        </div>
                        <span className={styles.toolkitName}>{tool.name}</span>
                        <span className="tech-tag tech-tag-mint">{tool.category}</span>
                      </div>
                    </div>

                    <div className={styles.commandSnippet}>
                      <code>$ {tool.command}</code>
                    </div>

                    <p className={styles.toolDescription}>{tool.description}</p>

                    <div className={styles.workflowRole}>
                      <span className={styles.roleLabel}>Workflow Impact:</span>
                      <p className={styles.roleText}>{tool.roleInWorkflow}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
