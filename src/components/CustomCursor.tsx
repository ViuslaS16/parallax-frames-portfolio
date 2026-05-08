"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Track mouse
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 mix-blend-difference pointer-events-none z-[9999] hidden lg:flex items-center justify-center"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
    >
      {/* Fixed inner dot */}
      <div className="w-3 h-3 bg-white rounded-full absolute" />

      {/* Pulsing outer circle */}
      <motion.div
        className="w-8 h-8 border border-white rounded-full absolute"
        animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
    </motion.div>
  );
}
