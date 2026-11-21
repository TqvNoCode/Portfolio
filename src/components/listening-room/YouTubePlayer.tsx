import React from 'react';
import styles from './ListeningRoom.module.css';

interface YouTubePlayerProps {
  containerId: string;
  isReady: boolean;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ containerId, isReady }) => {
  return (
    <div className={styles.playerFrameContainer}>
      {/* 
        Official YouTube Policy Compliance:
        1. Player viewport >= 200x200px (desktop 16:9 ~480x270).
        2. Native controls enabled and completely unobstructed.
        3. No overlays covering video canvas or player chrome.
      */}
      <div className={styles.videoAspectWrapper}>
        <div id={containerId} className={styles.nativePlayerMount} />
        {!isReady && (
          <div className={styles.playerPlaceholder} aria-hidden="true">
            <div className={styles.placeholderPulse} />
            <span className={styles.placeholderText}>Initializing YouTube Stream Engine...</span>
          </div>
        )}
      </div>
    </div>
  );
};
