"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Agency", "Logic", "Systems", "Automation"];

// Find the longest word to use as a stable width spacer so all words stay centered
const longestWord = WORDS.reduce((longest, word) =>
  word.length > longest.length ? word : longest
);

export default function RotatingWord({ align = "center" }: { align?: "center" | "left" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2800); // cycle words every 2.8s
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex relative overflow-visible text-left pb-4">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ opacity: 0, filter: "blur(12px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(12px)", y: -12 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute ${align === "center" ? "left-1/2 -translate-x-1/2" : "left-0"} text-[#35d0ff] font-normal font-story pb-4 pl-2 whitespace-nowrap`}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
      {/* Invisible spacer to reserve layout width for the longest word so all words stay centered */}
      <span className="opacity-0 font-normal font-story pb-4 pl-2 select-none pointer-events-none whitespace-nowrap" aria-hidden="true">
        {longestWord}
      </span>
    </span>
  );
}
