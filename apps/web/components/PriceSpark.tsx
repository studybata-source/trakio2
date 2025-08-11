"use client";
import { motion } from "framer-motion";

export function PriceSpark({ d }: { d: string }) {
  return (
    <motion.svg width="100%" height="40" viewBox="0 0 600 40">
      <defs>
        <linearGradient id="neon" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(var(--brand-hue) var(--brand-sat) 70%)" />
          <stop offset="100%" stopColor="white" />
        </linearGradient>
      </defs>
      <motion.path
        d={d}
        stroke="url(#neon)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ filter: "drop-shadow(0 0 8px var(--accent))" }}
      />
    </motion.svg>
  );
}