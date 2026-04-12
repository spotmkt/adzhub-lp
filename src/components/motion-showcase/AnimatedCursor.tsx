import { motion } from "framer-motion";

interface AnimatedCursorProps {
  x: number;
  y: number;
  clicking?: boolean;
}

export const AnimatedCursor = ({ x, y, clicking = false }: AnimatedCursorProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      animate={{
        x,
        y,
        scale: clicking ? 0.85 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
        mass: 0.5,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.85a.5.5 0 0 0-.85.36Z"
          fill="hsl(var(--foreground))"
          stroke="hsl(var(--background))"
          strokeWidth="1.5"
        />
      </svg>

      {clicking && (
        <motion.div
          className="absolute top-0 left-0 w-8 h-8 rounded-full bg-primary/30"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.div>
  );
};
