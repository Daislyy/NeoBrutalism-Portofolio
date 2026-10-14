"use client";

import { useEffect, useRef } from "react";

// Snake segment count & size (neo-brutalist: squares, not circles)
const SEGMENT_COUNT = 14;
const HEAD_SIZE = 18;
const TAIL_SIZE = 8;
const LERP = 0.18; // how tightly each segment follows the one in front

interface Segment {
  x: number;
  y: number;
}

// Alternating neo-brutalist palette: yellow → orange → cream → repeat
const SEGMENT_COLORS = [
  "#FFB800", // head — bold yellow
  "#FF5C00",
  "#FFB800",
  "#FF5C00",
  "#FFD600",
  "#FF5C00",
  "#FFB800",
  "#FF5C00",
  "#FFD600",
  "#FF5C00",
  "#FFB800",
  "#FF5C00",
  "#FFD600",
  "#FFECC7", // tail — cream
];

export default function SnakeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const segmentsRef = useRef<Segment[]>([]);
  const mouseRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    // Skip entirely on touch-only devices (phones/tablets)
    const isTouchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouchOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Init segments off-screen
    segmentsRef.current = Array.from({ length: SEGMENT_COUNT }, () => ({
      x: -200,
      y: -200,
    }));

    // Resize canvas to full viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Track mouse
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      visibleRef.current = true;
    };
    const onMouseLeave = () => {
      visibleRef.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    // Animation loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const segs = segmentsRef.current;

      // Move head toward mouse
      segs[0].x += (mouseRef.current.x - segs[0].x) * LERP;
      segs[0].y += (mouseRef.current.y - segs[0].y) * LERP;

      // Move each subsequent segment toward the one in front
      for (let i = 1; i < segs.length; i++) {
        segs[i].x += (segs[i - 1].x - segs[i].x) * LERP;
        segs[i].y += (segs[i - 1].y - segs[i].y) * LERP;
      }

      // Draw segments from tail to head (so head is on top)
      for (let i = segs.length - 1; i >= 0; i--) {
        const t = i / (segs.length - 1); // 0 = head, 1 = tail
        const size = HEAD_SIZE - (HEAD_SIZE - TAIL_SIZE) * t;
        const half = size / 2;

        const color = SEGMENT_COLORS[i] ?? "#FFB800";
        const alpha = 1 - t * 0.55; // fade toward tail

        // Rotation: calculate angle to next segment
        let angle = 0;
        if (i < segs.length - 1) {
          const dx = segs[i].x - segs[i + 1].x;
          const dy = segs[i].y - segs[i + 1].y;
          angle = Math.atan2(dy, dx);
        }

        ctx.save();
        ctx.translate(segs[i].x, segs[i].y);
        ctx.rotate(angle);
        ctx.globalAlpha = alpha;

        // Shadow (neo-brutalist hard offset)
        if (i === 0) {
          ctx.shadowColor = "#000";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
        }

        // Fill square segment
        ctx.fillStyle = color;
        ctx.beginPath();
        // Slightly rounded squares — neo-brutalist feel
        const r = size < 12 ? 2 : 4;
        ctx.roundRect(-half, -half, size, size, r);
        ctx.fill();

        // Bold black border
        ctx.globalAlpha = alpha * 0.9;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = i === 0 ? 2.5 : 1.5;
        ctx.stroke();

        // Eyes on the head (segment 0)
        if (i === 0) {
          ctx.globalAlpha = 1;
          const eyeSize = 3.5;
          const eyeOffset = size * 0.18;

          // White of eyes
          ctx.fillStyle = "#FBF9F5";
          ctx.beginPath();
          ctx.arc(-eyeOffset, -eyeOffset, eyeSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(eyeOffset, -eyeOffset, eyeSize, 0, Math.PI * 2);
          ctx.fill();

          // Pupils
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.arc(-eyeOffset + 1, -eyeOffset + 1, 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(eyeOffset + 1, -eyeOffset + 1, 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Tongue (tiny forked line)
          ctx.strokeStyle = "#FF5C00";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(half - 1, 0);
          ctx.lineTo(half + 5, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(half + 5, 0);
          ctx.lineTo(half + 8, -3);
          ctx.moveTo(half + 5, 0);
          ctx.lineTo(half + 8, 3);
          ctx.stroke();
        }

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99998,
      }}
    />
  );
}
