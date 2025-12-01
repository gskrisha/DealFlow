export const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.995 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -8, scale: 0.995 }
};

export const pageTransition = {
  type: "spring",
  stiffness: 160,
  damping: 18
};

export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.42, ease: "easeOut" }
};

export const cardHover = {
  whileHover: { y: -6, boxShadow: "0px 12px 30px rgba(16,24,40,0.08)", scale: 1.01 },
  whileTap: { scale: 0.995 }
};

export const staggerList = {
  animate: {
    transition: {
      staggerChildren: 0.06
    }
  }
};

export const listItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.36, ease: "easeOut" }
};
