import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { ENGINEERING_NOTES } from '../../data/notes';
import { SpotlightCard } from '../react-bits/SpotlightCard';
import styles from './EngineeringNotes.module.css';

export const EngineeringNotes: React.FC = () => {
  return (
    <section id="notes" className={styles.notesSection} aria-label="Engineering Notes and Technical Insights">
      <div className={`container ${styles.notesContainer}`}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowPrefix}>//</span>
            <span>WRITING &amp; EXPERIMENTS</span>
          </div>
          <h2 className={styles.sectionTitle}>Engineering Notes</h2>
          <p className={styles.sectionLead}>
            Documented reflections, architecture decisions, and workflow insights from building software systems and configuring development tooling.
          </p>
        </div>

        {/* Notes Grid */}
        <div className={styles.notesGrid}>
          {ENGINEERING_NOTES.map((note) => (
            <SpotlightCard
              key={note.id}
              className={styles.noteCard}
              spotlightColor="rgba(232, 185, 135, 0.12)"
            >
              <div className={styles.noteMeta}>
                <div className={styles.metaItem}>
                  <Calendar size={13} aria-hidden="true" />
                  <span>{note.date}</span>
                </div>
                <span className={styles.metaDivider}>•</span>
                <div className={styles.metaItem}>
                  <Clock size={13} aria-hidden="true" />
                  <span>{note.readingTime}</span>
                </div>
              </div>

              <h3 className={styles.noteTitle}>{note.title}</h3>
              <p className={styles.noteExcerpt}>{note.excerpt}</p>

              <div className={styles.noteContentPreview}>
                {note.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className={styles.noteParagraph}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className={styles.noteFooter}>
                <div className={styles.tagList}>
                  {note.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="tech-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};
