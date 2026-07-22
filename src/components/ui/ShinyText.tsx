"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ShinyText({ text }: { text: string }) {
  return (
    <motion.span
      className="inline-block"
      style={{
        backgroundImage: "linear-gradient(100deg, #64CEFB 35%, #ffffff 50%, #64CEFB 65%)",
        backgroundSize: "200% auto",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
      animate={{
        backgroundPositionX: ["150%", "-150%"],
      }}
      transition={{
        duration: 3,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {text}
    </motion.span>
  );
}
