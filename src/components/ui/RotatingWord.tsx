"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["Expertise", "Services", "Agency", "Develope"];

export default function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2800); // cycle words every 2.8s
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex relative overflow-visible text-left">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ opacity: 0, filter: "blur(12px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(12px)", y: -12 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 bg-clip-text text-transparent bg-gradient-to-r from-[#35d0ff] to-[#8b7bff] font-extrabold"
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
      {/* Invisible spacer to reserve layout width dynamically */}
      <span className="opacity-0 font-extrabold select-none pointer-events-none" aria-hidden="true">
        Expertise
      </span>
    </span>
  );
}
