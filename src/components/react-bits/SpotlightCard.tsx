import React, { useEffect, useRef } from 'react';
import './SpotlightCard.css';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(134, 213, 206, 0.12)',
  style,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--spotlight-color', spotlightColor);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [spotlightColor]);

  return (
    <div ref={cardRef} className={`spotlight-card ${className}`} style={style} {...rest}>
      <div className="spotlight-card__spotlight" aria-hidden="true" />
      <div className="spotlight-card__content">{children}</div>
    </div>
  );
};

export default SpotlightCard;
