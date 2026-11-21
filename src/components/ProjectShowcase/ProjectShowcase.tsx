import React, { useState } from 'react';
import {
  ExternalLink,
  FolderGit2,
  Cpu,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Layers,
  GitBranch,
} from 'lucide-react';
import { FEATURED_PROJECT } from '../../data/projects';
import { SpotlightCard } from '../react-bits/SpotlightCard';
import styles from './ProjectShowcase.module.css';

export const ProjectShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'decisions' | 'verification'>('architecture');
  const project = FEATURED_PROJECT;

  return (
    <section id="projects" className={styles.projectSection} aria-label="Featured Project Case Study">
      <div className={`container ${styles.projectContainer}`}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowPrefix}>//</span>
            <span>FEATURED CASE STUDY</span>
          </div>
          <div className={styles.headerFlex}>
            <div>
              <h2 className={styles.projectTitle}>{project.title}</h2>
              <p className={styles.projectSubtitle}>{project.subtitle}</p>
            </div>
            <div className={styles.phaseBadge} title="Verified Project Status">
              <span className={styles.phaseDot}></span>
              <span>{project.phase}</span>
            </div>
          </div>
        </div>

        {/* Case Study Hero Showcase Banner */}
        <div className={styles.caseStudyCard}>
          <div className={styles.caseOverview}>
            <div className={styles.overviewText}>
              <div className={styles.tagStrip}>
                <span className="tech-tag tech-tag-mint">Desktop Application</span>
                <span className="tech-tag">Linux Native</span>
                <span className="tech-tag tech-tag-warm">Math &amp; ODE Solvers</span>
                <span className="tech-tag">uv + Python</span>
              </div>

              <p className={styles.summaryText}>{project.summary}</p>

              {/* Problem & Goals */}
              <div className={styles.problemBox}>
                <h3 className={styles.subHeading}>The Engineering Challenge</h3>
                <p className={styles.problemText}>{project.problem}</p>
              </div>

              <div className={styles.goalsBox}>
                <h3 className={styles.subHeading}>Core Engineering Goals</h3>
                <ul className={styles.goalsList}>
                  {project.goals.map((goal, idx) => (
                    <li key={idx} className={styles.goalItem}>
                      <CheckCircle2 size={16} className={styles.goalCheck} aria-hidden="true" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verified Action Link */}
              <div className={styles.actionRow}>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryLink}
                  aria-label="View MathWeave Studio source repository on GitHub"
                >
                  <FolderGit2 size={16} aria-hidden="true" />
                  <span>Inspect Source on GitHub</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>

                <div className={styles.verifiedRepoInfo}>
                  <GitBranch size={14} className={styles.repoBranchIcon} aria-hidden="true" />
                  <span>Repo: TqvNoCode/MathWeave-Studio</span>
                </div>
              </div>
            </div>

            {/* Visual Blueprint Diagram */}
            <div className={styles.blueprintPanel} aria-label="MathWeave System Pipeline Blueprint">
              <div className={styles.blueprintHeader}>
                <Terminal size={14} aria-hidden="true" />
                <span className={styles.blueprintTitle}>mathweave_pipeline.diag</span>
                <span className={styles.blueprintStatus}>AST &amp; ODE Engine</span>
              </div>

              <div className={styles.blueprintContent}>
                <div className={styles.pipelineStep}>
                  <div className={styles.stepNum}>01</div>
                  <div className={styles.stepBody}>
                    <div className={styles.stepTitle}>Expression Parser</div>
                    <div className={styles.stepDesc}>Tokenize equation &amp; construct sanitized AST</div>
                  </div>
                </div>

                <div className={styles.pipelineArrow}>↓</div>

                <div className={`${styles.pipelineStep} ${styles.pipelineStepActive}`}>
                  <div className={styles.stepNum}>02</div>
                  <div className={styles.stepBody}>
                    <div className={styles.stepTitle}>ODE &amp; Numerical Engine</div>
                    <div className={styles.stepDesc}>Solve boundary conditions with multi-round audit precision</div>
                  </div>
                </div>

                <div className={styles.pipelineArrow}>↓</div>

                <div className={styles.pipelineStep}>
                  <div className={styles.stepNum}>03</div>
                  <div className={styles.stepBody}>
                    <div className={styles.stepTitle}>Visualization Surface</div>
                    <div className={styles.stepDesc}>Project 3D surface mesh &amp; step-by-step traces</div>
                  </div>
                </div>

                <div className={styles.pipelineArrow}>↓</div>

                <div className={styles.pipelineStep}>
                  <div className={styles.stepNum}>04</div>
                  <div className={styles.stepBody}>
                    <div className={styles.stepTitle}>Linux Desktop Shell</div>
                    <div className={styles.stepDesc}>Standalone executable with PyInstaller spec &amp; .desktop</div>
                  </div>
                </div>
              </div>

              <div className={styles.blueprintFooter}>
                <span>Verified with: `uv run pytest -q`</span>
                <span className={styles.greenText}>PASS (Phase 1)</span>
              </div>
            </div>
          </div>

          {/* Deep-Dive Tabs */}
          <div className={styles.tabsSection}>
            <div className={styles.tabList} role="tablist" aria-label="MathWeave Exploration Tabs">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'architecture'}
                className={`${styles.tabBtn} ${activeTab === 'architecture' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('architecture')}
              >
                <Layers size={16} aria-hidden="true" />
                <span>Technical Architecture</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'decisions'}
                className={`${styles.tabBtn} ${activeTab === 'decisions' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('decisions')}
              >
                <Cpu size={16} aria-hidden="true" />
                <span>Engineering Decisions</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'verification'}
                className={`${styles.tabBtn} ${activeTab === 'verification' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('verification')}
              >
                <ShieldCheck size={16} aria-hidden="true" />
                <span>Testing &amp; Verification</span>
              </button>
            </div>

            <div className={styles.tabContent} role="tabpanel">
              {/* Tab 1: Architecture Layers */}
              {activeTab === 'architecture' && (
                <div className={styles.architectureGrid}>
                  {project.architecture.map((layer, idx) => (
                    <SpotlightCard key={idx} className={styles.layerCard}>
                      <div className={styles.layerHeader}>
                        <h4 className={styles.layerTitle}>{layer.name}</h4>
                      </div>
                      <p className={styles.layerDesc}>{layer.description}</p>
                      <div className={styles.layerTechList}>
                        {layer.tech.map((t, tidx) => (
                          <span key={tidx} className="tech-tag tech-tag-mint">
                            {t}
                          </span>
                        ))}
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              )}

              {/* Tab 2: Decisions */}
              {activeTab === 'decisions' && (
                <div className={styles.decisionsList}>
                  {project.engineeringDecisions.map((dec, idx) => (
                    <div key={idx} className={styles.decisionItem}>
                      <div className={styles.decisionIconCol}>
                        <div className={styles.decisionMarker}>{idx + 1}</div>
                      </div>
                      <div className={styles.decisionBody}>
                        <h4 className={styles.decisionTitle}>{dec.title}</h4>
                        <div className={styles.decisionBlock}>
                          <span className={styles.decisionLabel}>Rationale:</span>
                          <p>{dec.rationale}</p>
                        </div>
                        <div className={styles.decisionBlock}>
                          <span className={`${styles.decisionLabel} ${styles.outcomeLabel}`}>Outcome:</span>
                          <p>{dec.outcome}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Verification & Quality */}
              {activeTab === 'verification' && (
                <div className={styles.verificationBox}>
                  <div className={styles.veriGrid}>
                    <div className={styles.veriCol}>
                      <h4 className={styles.veriHeader}>Verification Framework</h4>
                      <p className={styles.veriText}>{project.verification.testFramework}</p>

                      <h4 className={styles.veriHeader}>Audit Methodology</h4>
                      <p className={styles.veriText}>{project.verification.auditScope}</p>

                      <h4 className={styles.veriHeader}>Desktop Packaging</h4>
                      <p className={styles.veriText}>{project.verification.packaging}</p>
                    </div>

                    <div className={styles.veriCol}>
                      <h4 className={styles.veriHeader}>Verified Engineering Highlights</h4>
                      <ul className={styles.veriHighlights}>
                        {project.verification.highlights.map((h, hidx) => (
                          <li key={hidx} className={styles.veriHighlightItem}>
                            <CheckCircle2 size={16} className={styles.veriCheck} aria-hidden="true" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={styles.terminalAuditBox}>
                        <code>$ uv run pytest tests/ -q</code>
                        <span className={styles.auditPassed}>72 passed in 1.48s [Phase 1 Verified]</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
