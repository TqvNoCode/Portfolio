import React from 'react';
import { Search, X } from 'lucide-react';
import styles from './ListeningRoom.module.css';

interface PlaylistSearchProps {
  value: string;
  onChange: (value: string) => void;
  totalLoaded: number;
  filteredCount: number;
}

export const PlaylistSearch: React.FC<PlaylistSearchProps> = ({
  value,
  onChange,
  totalLoaded,
  filteredCount,
}) => {
  return (
    <div className={styles.searchWrapper}>
      <Search size={14} className={styles.searchIcon} aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter by title or creator..."
        className={styles.searchInput}
        aria-label="Filter playlist tracks"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className={styles.clearSearchButton}
          aria-label="Clear search filter"
          title="Clear search"
        >
          <X size={13} />
        </button>
      )}
      {value && (
        <span className={styles.searchCountBadge}>
          {filteredCount}/{totalLoaded}
        </span>
      )}
    </div>
  );
};
