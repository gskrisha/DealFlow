import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export function CountUp({ from = 0, to, duration = 1.5, suffix = "", decimals = 0 }) {
  const controls = useAnimation();
  const [value, setValue] = useState(from);

  useEffect(() => {
    controls.start({
      val: to,
      transition: { duration, ease: "easeOut" }
    });
  }, [to]);

  return (
    <motion.span
      initial={{ val: from }}
      animate={controls}
      onUpdate={(latest) => {
        const num = Number(latest.val).toFixed(decimals);
        setValue(num);
      }}
    >
      {value}{suffix}
    </motion.span>
  );
}