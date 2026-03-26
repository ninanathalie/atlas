"use client";

import { useEffect, useRef } from "react";

const DEFAULT_COLORS = ["#0DFFF7", "#0BC5BF"];

interface FlickeringGridProps {
 className?: string;
 squareSize?: number;
 gridGap?: number;
 flickerChance?: number;
 maxOpacity?: number;
 colors?: string[];
 style?: React.CSSProperties;
}

export function FlickeringGrid({
 className = "",
 squareSize = 3,
 gridGap = 7,
 flickerChance = 0.025,
 maxOpacity = 0.12,
 colors = DEFAULT_COLORS,
 style,
}: FlickeringGridProps) {
 const canvasRef = useRef<HTMLCanvasElement>(null);

 useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const opacities: number[] = [];
  const colorIndices: number[] = [];
  let cols = 0;
  let rows = 0;
  let animId: number;

  const init = () => {
   const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
   const rect = canvas.getBoundingClientRect();
   canvas.width = rect.width * dpr;
   canvas.height = rect.height * dpr;
   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
   cols = Math.ceil(rect.width / (squareSize + gridGap));
   rows = Math.ceil(rect.height / (squareSize + gridGap));
   const total = cols * rows;
   opacities.length = 0;
   colorIndices.length = 0;
   for (let i = 0; i < total; i++) {
    opacities.push(Math.random() * maxOpacity);
    colorIndices.push(Math.floor(Math.random() * colors.length));
   }
  };

  const draw = () => {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   for (let i = 0; i < opacities.length; i++) {
    if (Math.random() < flickerChance) {
     opacities[i] = Math.random() * maxOpacity;
     colorIndices[i] = Math.floor(Math.random() * colors.length);
    }
    const col = i % cols;
    const row = Math.floor(i / cols);
    ctx.globalAlpha = opacities[i];
    ctx.fillStyle = colors[colorIndices[i]];
    ctx.fillRect(
     col * (squareSize + gridGap),
     row * (squareSize + gridGap),
     squareSize,
     squareSize
    );
   }
   ctx.globalAlpha = 1;
   animId = requestAnimationFrame(draw);
  };

  const ro = new ResizeObserver(init);
  ro.observe(canvas);
  init();
  draw();

  return () => {
   ro.disconnect();
   cancelAnimationFrame(animId);
  };
 }, [squareSize, gridGap, flickerChance, maxOpacity, colors]);

 return (
  <canvas
   ref={canvasRef}
   className={`block ${className}`}
   style={style}
   aria-hidden="true"
   role="presentation"
  />
 );
}
