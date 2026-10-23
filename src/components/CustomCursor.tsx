"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device has touch screen
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.tagName === "TEXTAREA" ||
          target.closest("button") ||
          target.closest("a") ||
          target.classList.contains("interactive-cursor"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  // Smooth trailing ring
  useEffect(() => {
    if (isTouch) return;
    let animId: number;
    const followCursor = () => {
      setTrailing((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.18,
        y: prev.y + (position.y - prev.y) * 0.18,
      }));
      animId = requestAnimationFrame(followCursor);
    };
    animId = requestAnimationFrame(followCursor);
    return () => cancelAnimationFrame(animId);
  }, [position, isTouch]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      {/* Central gold dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${
            isHovered ? 1.8 : 1
          })`,
        }}
      >
        <div className="w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_10px_#D4AF37]" />
      </div>

      {/* Outer subtle gold ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998] transition-all duration-300 ease-out"
        style={{
          transform: `translate3d(${trailing.x}px, ${trailing.y}px, 0) translate(-50%, -50%) scale(${
            isHovered ? 1.6 : 1
          })`,
        }}
      >
        <div
          className={`rounded-full border transition-all duration-300 ${
            isHovered
              ? "w-10 h-10 border-gold-400/80 bg-gold-500/10 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              : "w-8 h-8 border-gold-500/30 bg-transparent"
          }`}
        />
      </div>
    </>
  );
}
