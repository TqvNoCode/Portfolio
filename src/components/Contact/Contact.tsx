import React, { useState } from 'react';
import { Mail, FolderGit2, Copy, Check, ExternalLink, Shield } from 'lucide-react';
import { PROFILE } from '../../data/profile';
import { SpotlightCard } from '../react-bits/SpotlightCard';
import styles from './Contact.module.css';

export const Contact: React.FC = () => {
  const [emailCopied, setEmailCopied] = useState<boolean>(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.social.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email', err);
    }
  };

  return (
    <section id="contact" className={styles.contactSection} aria-label="Contact and Social Verification">
      <div className={`container ${styles.contactContainer}`}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowPrefix}>//</span>
            <span>COMMUNICATION CHANNELS</span>
          </div>
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          <p className={styles.sectionLead}>
            Interested in software engineering, applied AI collaborations, or systems discussions? Connect through verified channels below.
          </p>
        </div>

        {/* Channels Grid */}
        <div className={styles.channelsGrid}>
          {/* Email Channel */}
          <SpotlightCard className={styles.channelCard} spotlightColor="rgba(134, 213, 206, 0.15)">
            <div className={styles.channelIconWrap}>
              <Mail size={22} className={styles.mintIcon} aria-hidden="true" />
            </div>
            <div className={styles.channelBody}>
              <span className={styles.channelLabel}>Direct Email</span>
              <span className={styles.channelValue}>{PROFILE.social.email}</span>
            </div>
            <div className={styles.channelActions}>
              <button
                type="button"
                onClick={handleCopyEmail}
                className={styles.copyBtn}
                aria-label={emailCopied ? 'Email address copied' : 'Copy email address'}
              >
                {emailCopied ? <Check size={14} /> : <Copy size={14} />}
                <span>{emailCopied ? 'Copied' : 'Copy'}</span>
              </button>
              <a
                href={`mailto:${PROFILE.social.email}`}
                className={styles.openBtn}
                aria-label="Send email via default client"
              >
                <span>Compose</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </SpotlightCard>

          {/* GitHub Channel */}
          <SpotlightCard className={styles.channelCard} spotlightColor="rgba(232, 185, 135, 0.15)">
            <div className={styles.channelIconWrap}>
              <FolderGit2 size={22} className={styles.warmIcon} aria-hidden="true" />
            </div>
            <div className={styles.channelBody}>
              <span className={styles.channelLabel}>Verified GitHub</span>
              <span className={styles.channelValue}>github.com/TqvNoCode</span>
            </div>
            <div className={styles.channelActions}>
              <a
                href={PROFILE.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryActionBtn}
                aria-label="Open TQV GitHub profile (@TqvNoCode)"
              >
                <span>Visit GitHub Profile</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </SpotlightCard>
        </div>

        {/* Verification Note */}
        <div className={styles.verificationNote}>
          <Shield size={16} className={styles.shieldIcon} aria-hidden="true" />
          <span>
            Identity and remotes authenticated with Git user <code>TqvNoCode</code>. All code and configurations are genuine and verifiable.
          </span>
        </div>
      </div>
    </section>
  );
};
