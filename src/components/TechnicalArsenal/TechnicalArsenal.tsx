import React, { useState } from 'react';
import { Code, Layers, Cpu, Server, Terminal } from 'lucide-react';
import { TECHNICAL_ARSENAL, SkillCategory } from '../../data/skills';
import { SpotlightCard } from '../react-bits/SpotlightCard';
import styles from './TechnicalArsenal.module.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  Code: <Code size={20} aria-hidden="true" />,
  Layers: <Layers size={20} aria-hidden="true" />,
  Cpu: <Cpu size={20} aria-hidden="true" />,
  Server: <Server size={20} aria-hidden="true" />,
  Terminal: <Terminal size={20} aria-hidden="true" />,
};

export const TechnicalArsenal: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCategories: SkillCategory[] =
    selectedCategory === 'all'
      ? TECHNICAL_ARSENAL
      : TECHNICAL_ARSENAL.filter((cat) => cat.id === selectedCategory);

  return (
    <section id="arsenal" className={styles.arsenalSection} aria-label="Technical Arsenal and Skills">
      <div className={`container ${styles.arsenalContainer}`}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowPrefix}>//</span>
            <span>CAPABILITIES &amp; EXPERIENCE</span>
          </div>
          <h2 className={styles.sectionTitle}>Technical Arsenal</h2>
          <p className={styles.sectionLead}>
            A curated inventory of programming languages, architectures, applied AI models, systems, and tools verified by real implementation. No arbitrary percentage bars or vanity scores.
          </p>
        </div>

        {/* Category Filters */}
        <div className={styles.filterRow} role="tablist" aria-label="Arsenal Filter Tabs">
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.filterBtnActive : ''}`}
          >
            All Categories
          </button>
          {TECHNICAL_ARSENAL.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`${styles.filterBtn} ${selectedCategory === cat.id ? styles.filterBtnActive : ''}`}
            >
              <span>{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Categories Stack */}
        <div className={styles.categoriesStack}>
          {filteredCategories.map((category) => (
            <div key={category.id} className={styles.categoryBlock}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIconWrap}>
                  {ICON_MAP[category.iconName] || <Terminal size={20} />}
                </div>
                <div>
                  <h3 className={styles.categoryTitle}>{category.title}</h3>
                  <p className={styles.categorySummary}>{category.summary}</p>
                </div>
              </div>

              <div className={styles.skillsGrid}>
                {category.skills.map((skill, sIdx) => (
                  <SpotlightCard
                    key={sIdx}
                    className={styles.skillCard}
                    spotlightColor="rgba(134, 213, 206, 0.12)"
                  >
                    <div className={styles.skillCardTop}>
                      <span className={styles.skillName}>{skill.name}</span>
                      <span className="tech-tag tech-tag-mint">{skill.tag}</span>
                    </div>
                    <p className={styles.skillDescription}>{skill.description}</p>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
