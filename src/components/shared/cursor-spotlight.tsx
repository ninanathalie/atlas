"use client";

import { useEffect, useRef } from "react";

interface CursorSpotlightProps {
 size?: number;
 className?: string;
}

export function CursorSpotlight({ size = 450, className = "" }: CursorSpotlightProps) {
 const ref = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const el = ref.current;
  if (!el) return;

  const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!mql.matches || reduced.matches) return;

  let rafId: number | null = null;
  let nextX = 0;
  let nextY = 0;

  const handleMove = (e: MouseEvent) => {
   nextX = e.clientX;
   nextY = e.clientY;
   if (rafId !== null) return;
   rafId = requestAnimationFrame(() => {
    el.style.setProperty("--cursor-x", `${nextX}px`);
    el.style.setProperty("--cursor-y", `${nextY}px`);
    rafId = null;
   });
  };

  window.addEventListener("mousemove", handleMove, { passive: true });
  return () => {
   window.removeEventListener("mousemove", handleMove);
   if (rafId !== null) cancelAnimationFrame(rafId);
  };
 }, []);

 return (
  <div
   ref={ref}
   aria-hidden
   className={`pointer-events-none fixed inset-0 z-1 ${className}`}
   style={{
    background: `radial-gradient(${size}px circle at var(--cursor-x, -9999px) var(--cursor-y, -9999px), var(--spotlight-color), transparent 80%)`,
   }}
  />
 );
}
