import React from 'react';
import { Headphones, Radio, Sparkles, ExternalLink } from 'lucide-react';
import { LISTENING_ROOM_CONFIG, parseYouTubePlaylistId, getEmbedUrl } from '../../data/listeningRoom';
import styles from './ListeningRoom.module.css';

export const ListeningRoom: React.FC = () => {
  const playlistId = parseYouTubePlaylistId(LISTENING_ROOM_CONFIG.playlistUrl);
  const embedUrl = getEmbedUrl(playlistId);

  return (
    <section id="listening-room" className={styles.listeningSection} aria-label="Audio Cadence and Listening Room">
      <div className={`container ${styles.listeningContainer}`}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowPrefix}>//</span>
            <span>AUDIO CADENCE &amp; FOCUS</span>
          </div>
          <h2 className={styles.sectionTitle}>{LISTENING_ROOM_CONFIG.title}</h2>
          <p className={styles.sectionLead}>{LISTENING_ROOM_CONFIG.description}</p>
        </div>

        {/* Player Card */}
        <div className={styles.playerCard}>
          {/* Card Topbar */}
          <div className={styles.playerHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.waveVisualizer} aria-hidden="true">
                <span className={styles.waveBar} style={{ animationDelay: '0.1s' }}></span>
                <span className={styles.waveBar} style={{ animationDelay: '0.3s' }}></span>
                <span className={styles.waveBar} style={{ animationDelay: '0.2s' }}></span>
                <span className={styles.waveBar} style={{ animationDelay: '0.4s' }}></span>
                <span className={styles.waveBar} style={{ animationDelay: '0.15s' }}></span>
              </div>
              <span className={styles.streamLabel}>{LISTENING_ROOM_CONFIG.subtitle}</span>
            </div>

            <div className={styles.headerRight}>
              <span className={styles.privacyBadge}>Privacy-Enhanced Stream</span>
            </div>
          </div>

          {/* Player Content Area */}
          {embedUrl ? (
            <div className={styles.iframeWrapper}>
              <iframe
                title="TQV Engineering Flow Playlist"
                src={embedUrl}
                className={styles.iframePlayer}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrap}>
                <Headphones size={36} className={styles.headphoneIcon} aria-hidden="true" />
              </div>
              <h3 className={styles.emptyTitle}>Playlist Coming Soon</h3>
              <p className={styles.emptyDesc}>
                Currently curating and sequencing the ideal deep-work audio frequencies (ambient electronica, modular synthesis, and generative drone).
              </p>
              <div className={styles.emptyMetadata}>
                <div className={styles.metaBadge}>
                  <Radio size={13} aria-hidden="true" />
                  <span>Cadence: 110–128 BPM Deep Focus</span>
                </div>
                <div className={styles.metaBadge}>
                  <Sparkles size={13} aria-hidden="true" />
                  <span>Status: Audio Stream Tuning</span>
                </div>
              </div>
              <div className={styles.codeHint}>
                <span>Config:</span>
                <code>src/data/listeningRoom.ts</code>
              </div>
            </div>
          )}

          {/* Card Footer */}
          <div className={styles.playerFooter}>
            <div className={styles.footerNote}>
              <span>Engineered for cognitive flow state during complex systems architecture and mathematical computation.</span>
            </div>
            {playlistId && (
              <a
                href={LISTENING_ROOM_CONFIG.playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.openStreamLink}
                aria-label="Open playlist on YouTube Music"
              >
                <span>Open in YouTube Music</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
