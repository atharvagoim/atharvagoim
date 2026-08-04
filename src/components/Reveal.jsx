import { motion } from "framer-motion";

// Wraps children in a fade + slide-up animation that triggers once when it
// scrolls into view. Keeps individual sections free of repeated boilerplate.
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.7,
  className = "",
  as = "div",
}) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
