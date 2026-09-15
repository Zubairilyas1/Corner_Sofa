'use client';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className={className} initial={false}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      transition={{ duration: reduceMotion ? 0 : 0.3, delay }}>
      {children}
    </motion.div>
  );
}
