import { useState } from 'react';
import { motion } from 'framer-motion';

import styles from './IntelliVariableProximity.module.css';

interface VariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
}

export const IntelliVariableProximity: React.FC<VariableProximityProps> = ({
  label,
  fromFontVariationSettings,
  toFontVariationSettings,
  containerRef,
  className = '',
}) => {
  const [, setMousePosition] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: -1000, y: -1000 });
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.srOnly}>{label}</span>
      <span aria-hidden="true" className={styles.words}>
        {label.split(' ').map((word, wordIndex) => (
          <span key={wordIndex} className={styles.word}>
            {word.split('').map((letter, letterIndex) => {
              // Simplified proximity effect logic for demonstration/fallback
              // A full React Bits VariableProximity uses useAnimationFrame and distance calculations.
              return (
                <motion.span
                  key={letterIndex}
                  className={styles.letter}
                  style={{ fontVariationSettings: fromFontVariationSettings }}
                  whileHover={{ fontVariationSettings: toFontVariationSettings }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {letter}
                </motion.span>
              );
            })}
            {wordIndex < label.split(' ').length - 1 && '\u00A0'}
          </span>
        ))}
      </span>
    </div>
  );
};
