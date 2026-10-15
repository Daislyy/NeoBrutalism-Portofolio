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
  const lastHeadAngleRef = useRef(0);
  const frameRef = useRef(0);
  const tongueTimerRef = useRef(0);
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

      frameRef.current++;
      const segs = segmentsRef.current;

      // Speed calculation for dynamic effects
      const headDist = Math.hypot(mouseRef.current.x - segs[0].x, mouseRef.current.y - segs[0].y);

      // Move head toward mouse
      segs[0].x += (mouseRef.current.x - segs[0].x) * LERP;
      segs[0].y += (mouseRef.current.y - segs[0].y) * LERP;

      // Move each subsequent segment toward the one in front
      for (let i = 1; i < segs.length; i++) {
        segs[i].x += (segs[i - 1].x - segs[i].x) * LERP;
        segs[i].y += (segs[i - 1].y - segs[i].y) * LERP;
      }

      // Tongue flick trigger
      if (headDist > 2.5) {
        if (tongueTimerRef.current <= 0 && Math.random() < 0.08) {
          tongueTimerRef.current = 24; // start flicking for 24 frames
        }
      } else if (frameRef.current % 140 === 0) {
        tongueTimerRef.current = 22; // periodic idle flick
      }

      let tongueProg = 0;
      if (tongueTimerRef.current > 0) {
        tongueTimerRef.current--;
        // 0 -> 1 -> 0 peak animation
        const norm = tongueTimerRef.current / 24;
        tongueProg = Math.sin(norm * Math.PI);
      }

      // Draw segments from tail to head (so head is on top)
      for (let i = segs.length - 1; i >= 0; i--) {
        const t = i / (segs.length - 1); // 0 = head, 1 = tail
        const size = HEAD_SIZE - (HEAD_SIZE - TAIL_SIZE) * t;
        const color = SEGMENT_COLORS[i] ?? "#FFB800";
        const alpha = 1 - t * 0.45; // gentle fade toward tail

        // Angle along movement direction
        let angle = lastHeadAngleRef.current;
        if (i < segs.length - 1) {
          const dx = segs[i].x - segs[i + 1].x;
          const dy = segs[i].y - segs[i + 1].y;
          if (Math.hypot(dx, dy) > 0.15) {
            angle = Math.atan2(dy, dx);
            if (i === 0) lastHeadAngleRef.current = angle;
          }
        }

        ctx.save();
        ctx.translate(segs[i].x, segs[i].y);
        ctx.rotate(angle);
        ctx.globalAlpha = alpha;

        if (i === 0) {
      
          const tongueLength = tongueProg * 14;
          const waggle = Math.sin(frameRef.current * 0.9) * 1.5;

          if (tongueLength > 0.5) {
            ctx.save();
            ctx.strokeStyle = "#D80000";
            ctx.lineWidth = 1.6;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            const stemStart = 14;
            const stemEnd = stemStart + tongueLength * 0.65;
            const tipEnd = stemStart + tongueLength;
            const forkW = 3.6;

            ctx.beginPath();
            ctx.moveTo(stemStart, 0);
            ctx.quadraticCurveTo((stemStart + stemEnd) / 2, waggle, stemEnd, waggle * 0.5);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(stemEnd, waggle * 0.5);
            ctx.lineTo(tipEnd, -forkW + waggle);
            ctx.moveTo(stemEnd, waggle * 0.5);
            ctx.lineTo(tipEnd, forkW + waggle);
            ctx.stroke();

            ctx.restore();
          }

          ctx.save();
          ctx.shadowColor = "#000000";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 3.5;
          ctx.shadowOffsetY = 3.5;

          ctx.beginPath();
          // Neck constriction
          ctx.moveTo(-10, -4.5);
          // Wide flared venom gland cheeks
          ctx.bezierCurveTo(-8.5, -9, -4.5, -10.5, -2, -10);
          // Temple / eye socket transition
          ctx.bezierCurveTo(2, -9.5, 5, -8, 8, -6);
          // Tapered snout
          ctx.bezierCurveTo(11, -4.5, 13.5, -3, 15.5, -1.5);
          // Blunt rounded rostral tip (snout)
          ctx.quadraticCurveTo(16.5, 0, 15.5, 1.5);
          // Lower snout
          ctx.bezierCurveTo(13.5, 3, 11, 4.5, 8, 6);
          // Lower temple
          ctx.bezierCurveTo(5, 8, 2, 9.5, -2, 10);
          // Lower venom gland
          ctx.bezierCurveTo(-4.5, 10.5, -8.5, 9, -10, 4.5);
          // Neck joint
          ctx.quadraticCurveTo(-11, 0, -10, -4.5);
          ctx.closePath();

          ctx.fillStyle = color;
          ctx.fill();

          // Reset shadow for crisp borders & interior scales
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2.4;
          ctx.lineJoin = "round";
          ctx.stroke();

          // 3. Dorsal Skull Armor Plates (Crown scale diamond)
          ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 1.3;

          ctx.beginPath();
          ctx.moveTo(-6, 0);
          ctx.lineTo(-2, -3.5);
          ctx.lineTo(3, -2.5);
          ctx.lineTo(5.5, 0);
          ctx.lineTo(3, 2.5);
          ctx.lineTo(-2, 3.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Snout nasal ridge line
          ctx.beginPath();
          ctx.moveTo(5.5, 0);
          ctx.lineTo(13.5, 0);
          ctx.stroke();

          // Pit organs / nostrils
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(12.5, -2.2, 0.9, 0, Math.PI * 2);
          ctx.arc(12.5, 2.2, 0.9, 0, Math.PI * 2);
          ctx.fill();

          // 4. Predatory Reptilian Eyes with Slit Pupils
          const renderViperEye = (ySign: number) => {
            const eyeX = 3.2;
            const eyeY = ySign * 6.2;

            ctx.save();
            ctx.translate(eyeX, eyeY);
            ctx.rotate(ySign * 0.25);

            // Menacing amber/gold reptilian iris
            ctx.beginPath();
            ctx.ellipse(0, 0, 3.3, 2.2, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#FFD000";
            ctx.fill();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Razor-sharp vertical slit pupil
            ctx.beginPath();
            ctx.moveTo(0, -2);
            ctx.quadraticCurveTo(0.75, 0, 0, 2);
            ctx.quadraticCurveTo(-0.75, 0, 0, -2);
            ctx.fillStyle = "#000000";
            ctx.fill();

            // Glint highlight
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(-0.7, -0.9, 0.7, 0.7);

            ctx.restore();

            // Supraocular scale (menacing heavy brow ridge over the eye)
            ctx.beginPath();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1.8;
            ctx.lineCap = "round";
            ctx.moveTo(eyeX - 3.2, eyeY - ySign * 2.2);
            ctx.lineTo(eyeX + 3.4, eyeY - ySign * 1.5);
            ctx.stroke();
          };

          renderViperEye(-1); // Left eye
          renderViperEye(1);  // Right eye

          ctx.restore();
        } else {
          // ─── SERPENTINE BODY SCUTE / SCALE SEGMENT ────────────────
          const half = size / 2;
          const len = size * 0.75;
          const isTail = i === segs.length - 1;

          ctx.fillStyle = color;
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 1.6;
          ctx.lineJoin = "round";

          ctx.beginPath();
          if (isTail) {
            // Tapered tail rattle / tip
            ctx.moveTo(len * 0.5, 0);
            ctx.lineTo(0, -half * 0.65);
            ctx.lineTo(-len * 1.6, 0);
            ctx.lineTo(0, half * 0.65);
          } else {
            // Interlocking hexagonal snake scale
            ctx.moveTo(len, 0);
            ctx.lineTo(len * 0.35, -half);
            ctx.lineTo(-len * 0.75, -half * 0.85);
            ctx.lineTo(-len, 0);
            ctx.lineTo(-len * 0.75, half * 0.85);
            ctx.lineTo(len * 0.35, half);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Dorsal spine ridge
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0, 0, 0, 0.28)";
          ctx.lineWidth = 1.1;
          ctx.moveTo(len * 0.55, 0);
          ctx.lineTo(-len * 0.55, 0);
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
