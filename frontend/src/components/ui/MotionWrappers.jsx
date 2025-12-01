import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pageVariants, pageTransition } from "../../lib/motionVariants";

export function PageTransition({ children, className = "" }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="page"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function MotionContainer({ children, ...props }) {
  return (
    <motion.div {...props}>
      {children}
    </motion.div>
  );
}
