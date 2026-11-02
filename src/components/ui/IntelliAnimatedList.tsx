import React from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './IntelliAnimatedList.module.css';

interface AnimatedListProps {
  className?: string;
  children: ReactNode;
  delay?: number;
}

export function IntelliAnimatedList({ className = '', children, delay = 0 }: AnimatedListProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={`${styles.list} ${className}`}>
      <AnimatePresence>
        {childrenArray.map((child, index) => (
          <AnimatedListItem key={(child as React.ReactElement).key || index} index={index} delay={delay}>
            {child}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
}

function AnimatedListItem({ children, index, delay }: { children: ReactNode; index: number; delay: number }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: 'spring', stiffness: 350, damping: 40, delay: delay + index * 0.1 },
  };

  return (
    <motion.div {...animations} transition={animations.transition as any} className={styles.item}>
      {children}
    </motion.div>
  );
}
