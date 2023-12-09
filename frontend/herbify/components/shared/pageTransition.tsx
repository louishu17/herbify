import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants: Variants = {
  initial: { opacity: 0, x: "-100vw" },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "100vw" },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: .3,
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

export default PageTransition;
