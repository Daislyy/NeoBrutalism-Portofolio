"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Skull } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DragonSkullSvg from "@/components/DragonSkullSvg";

// ─── Web Audio: Iconic Kaiju / Godzilla Roar ─────────────────────────────────
let audioCtx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
}

function playGodzillaRoar() {
  const ctx = getCtx();
  if (ctx.state === "suspended") ctx.resume();
  const now = ctx.currentTime;

  // Master Gain & Limiter
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.9, now);
  master.connect(ctx.destination);

  // Distortion curve
  const ws = ctx.createWaveShaper();
  const curve = new Float32Array(512);
  for (let i = 0; i < 512; i++) {
    const x = (i * 2) / 512 - 1;
    curve[i] = (Math.PI + 6) * x / (Math.PI + 6 * Math.abs(x));
  }
  ws.curve = curve;
  ws.connect(master);

  // Reverb/Echo Delay loop for stadium/city echo
  const delay = ctx.createDelay();
  delay.delayTime.value = 0.18;
  const delayGain = ctx.createGain();
  delayGain.gain.value = 0.38;
  const delayFilter = ctx.createBiquadFilter();
  delayFilter.type = "lowpass";
  delayFilter.frequency.value = 900;
  delay.connect(delayFilter).connect(delayGain);
  delayGain.connect(delay);
  delayGain.connect(master);

  // ── 1. The Iconic High Metallic Screech (FM Synthesis) ──
  // Godzilla's signature "string friction" shrieking wail
  const carrier = ctx.createOscillator();
  const modulator = ctx.createOscillator();
  const modGain = ctx.createGain();

  carrier.type = "sawtooth";
  // Pitch rises violently then wavers and drops
  carrier.frequency.setValueAtTime(320, now);
  carrier.frequency.exponentialRampToValueAtTime(780, now + 0.35);
  carrier.frequency.exponentialRampToValueAtTime(920, now + 0.7);
  carrier.frequency.exponentialRampToValueAtTime(450, now + 1.4);
  carrier.frequency.exponentialRampToValueAtTime(140, now + 2.3);

  modulator.type = "square";
  modulator.frequency.setValueAtTime(140, now);
  modulator.frequency.exponentialRampToValueAtTime(260, now + 0.6);
  modulator.frequency.exponentialRampToValueAtTime(75, now + 1.8);

  modGain.gain.setValueAtTime(600, now);
  modGain.gain.exponentialRampToValueAtTime(1200, now + 0.4);
  modGain.gain.exponentialRampToValueAtTime(250, now + 1.6);
  modulator.connect(modGain);
  modGain.connect(carrier.frequency);

  const screechFilter = ctx.createBiquadFilter();
  screechFilter.type = "bandpass";
  screechFilter.frequency.setValueAtTime(650, now);
  screechFilter.frequency.exponentialRampToValueAtTime(1400, now + 0.5);
  screechFilter.frequency.exponentialRampToValueAtTime(400, now + 1.8);
  screechFilter.Q.value = 4.2;

  const screechGain = ctx.createGain();
  screechGain.gain.setValueAtTime(0, now);
  screechGain.gain.linearRampToValueAtTime(1.1, now + 0.12);
  screechGain.gain.setValueAtTime(1.3, now + 0.5);
  screechGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

  carrier.connect(screechFilter).connect(screechGain).connect(ws);
  screechGain.connect(delay);
  carrier.start(now);
  modulator.start(now);
  carrier.stop(now + 2.3);
  modulator.stop(now + 2.3);

  // ── 2. Massive Colossal Bellow & Guttural Growl ──
  // Heavy low sawtooth with guttural vocal cord flutter (LFO AM)
  const bellow = ctx.createOscillator();
  bellow.type = "sawtooth";
  bellow.frequency.setValueAtTime(180, now + 0.3);
  bellow.frequency.exponentialRampToValueAtTime(240, now + 0.8);
  bellow.frequency.exponentialRampToValueAtTime(70, now + 2.0);
  bellow.frequency.exponentialRampToValueAtTime(38, now + 2.9);

  // Guttural flutter LFO (22Hz down to 14Hz)
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(24, now + 0.3);
  lfo.frequency.linearRampToValueAtTime(14, now + 2.5);

  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(0.4, now + 0.3);

  const bellowGain = ctx.createGain();
  bellowGain.gain.setValueAtTime(0, now + 0.3);
  bellowGain.gain.linearRampToValueAtTime(1.5, now + 0.6);
  bellowGain.gain.setValueAtTime(1.6, now + 1.2);
  bellowGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

  lfo.connect(lfoGain);
  lfoGain.connect(bellowGain.gain);

  const bellowFilter = ctx.createBiquadFilter();
  bellowFilter.type = "lowpass";
  bellowFilter.frequency.setValueAtTime(950, now + 0.3);
  bellowFilter.frequency.exponentialRampToValueAtTime(250, now + 2.4);

  bellow.connect(bellowFilter).connect(bellowGain).connect(ws);
  bellowGain.connect(delay);
  bellow.start(now + 0.3);
  lfo.start(now + 0.3);
  bellow.stop(now + 3.0);
  lfo.stop(now + 3.0);

  // ── 3. Earth-Shattering Sub-Bass Rumble ──
  const sub = ctx.createOscillator();
  sub.type = "sine";
  sub.frequency.setValueAtTime(65, now + 0.2);
  sub.frequency.exponentialRampToValueAtTime(28, now + 2.2);
  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0, now);
  subGain.gain.linearRampToValueAtTime(2.2, now + 0.5);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
  sub.connect(subGain).connect(master);
  sub.start(now + 0.2);
  sub.stop(now + 2.8);

  // ── 4. Atomic Breath / Throat Air Rush Noise ──
  const bufSize = Math.floor(ctx.sampleRate * 2.8);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.9;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(1600, now + 0.2);
  noiseFilter.frequency.exponentialRampToValueAtTime(450, now + 1.8);
  noiseFilter.frequency.exponentialRampToValueAtTime(150, now + 2.6);
  noiseFilter.Q.value = 2.0;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, now + 0.2);
  noiseGain.gain.linearRampToValueAtTime(1.1, now + 0.6);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

  noise.connect(noiseFilter).connect(noiseGain).connect(master);
  noise.start(now + 0.2);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function DragonRoar() {
  const [roaring, setRoaring] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    type: "fire" | "smoke" | "spark";
  }>>([]);

  const handleRoar = useCallback(() => {
    if (roaring) return;
    playGodzillaRoar();
    setRoaring(true);
    timeoutRef.current = setTimeout(() => {
      setRoaring(false);
    }, 3200);
  }, [roaring]);

  // Particle explosion & smoke simulation
  useEffect(() => {
    if (!roaring) {
      particlesRef.current = [];
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    frameRef.current = 0;
    particlesRef.current = [];

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      frameRef.current++;
      const pList = particlesRef.current;
      const mouthX = w / 2;
      const mouthY = h / 2 + 130; // aligned directly in the gaping fangs of the dragon skull

      // 1. Blazing Atomic Core Glow in the mouth
      if (frameRef.current < 140) {
        const glowRadius = 90 + Math.random() * 30;
        const grad = ctx.createRadialGradient(mouthX, mouthY, 5, mouthX, mouthY, glowRadius);
        grad.addColorStop(0, "rgba(255, 255, 220, 0.95)");
        grad.addColorStop(0.25, "rgba(255, 140, 0, 0.85)");
        grad.addColorStop(0.65, "rgba(255, 20, 0, 0.5)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouthX, mouthY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Spawn 16 Hellfire Blocks per frame
        for (let i = 0; i < 16; i++) {
          const angle = Math.PI / 2 + (Math.random() - 0.5) * 1.6; // blasting downward and outward
          const spd = 6 + Math.random() * 15;
          pList.push({
            x: mouthX + (Math.random() - 0.5) * 60,
            y: mouthY + (Math.random() - 0.5) * 20,
            vx: Math.cos(angle) * spd + (Math.random() - 0.5) * 6,
            vy: Math.sin(angle) * spd + 3,
            life: 0,
            maxLife: 28 + Math.random() * 35,
            size: 10 + Math.random() * 24,
            color: ["#FFFFFF", "#FFEE00", "#FF8800", "#FF3300", "#FF0033", "#FF0000"][Math.floor(Math.random() * 6)],
            type: "fire",
          });
        }

        // 3. Spawn 8 High-Speed Electric Sparks
        for (let i = 0; i < 8; i++) {
          const sparkAngle = Math.random() * Math.PI * 2;
          const sparkSpd = 10 + Math.random() * 24;
          pList.push({
            x: mouthX + (Math.random() - 0.5) * 40,
            y: mouthY + (Math.random() - 0.5) * 20,
            vx: Math.cos(sparkAngle) * sparkSpd,
            vy: Math.sin(sparkAngle) * sparkSpd,
            life: 0,
            maxLife: 15 + Math.random() * 22,
            size: 4 + Math.random() * 7,
            color: ["#FFFFFF", "#FFFF44", "#FFDD00", "#FF6600"][Math.floor(Math.random() * 4)],
            type: "spark",
          });
        }

        // 4. Spawn Billowing Charcoal Smoke
        if (Math.random() < 0.75) {
          pList.push({
            x: mouthX + (Math.random() - 0.5) * 90,
            y: mouthY - 15,
            vx: (Math.random() - 0.5) * 5,
            vy: -2 - Math.random() * 4, // smoke billows up
            life: 0,
            maxLife: 60 + Math.random() * 40,
            size: 26 + Math.random() * 36,
            color: "#141414",
            type: "smoke",
          });
        }
      }

      // Render & update particles
      for (let i = pList.length - 1; i >= 0; i--) {
        const p = pList[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life >= p.maxLife) {
          pList.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        const alpha = 1 - progress;

        ctx.save();
        if (p.type === "smoke") {
          ctx.globalAlpha = alpha * 0.55;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + progress * 1.8), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "spark") {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else {
          // Fire pixel block with neo-brutalist border
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2.5;
          const s = p.size * (1 - progress * 0.35);
          ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
          ctx.strokeRect(p.x - s / 2, p.y - s / 2, s, s);
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafRef.current);
  }, [roaring]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Neo-brutalist Kaiju Trigger Button — bottom-left */}
      <button
        onClick={handleRoar}
        disabled={roaring}
        aria-label="Awaken Kaiju"
        title="[WARNING] KAIJU AWAKENING PROTOCOL"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 99997,
          height: "48px",
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: roaring ? "wait" : "pointer",
          userSelect: "none",
          backgroundColor: roaring ? "#FF0000" : "#0D0D0D",
          color: roaring ? "#FFFFFF" : "#FF3B30",
          border: "3px solid #000000",
          borderRadius: "8px",
          boxShadow: roaring ? "0 0 0 #000" : "5px 5px 0px #000000",
          transform: roaring ? "translate(3px, 3px)" : "translate(0, 0)",
          transition: "all 0.15s cubic-bezier(.34,1.56,.64,1)",
          fontFamily: "'Courier New', monospace",
          fontWeight: 900,
          fontSize: "12px",
          letterSpacing: "0.12em",
        }}
        onMouseEnter={e => {
          if (!roaring) {
            e.currentTarget.style.transform = "translate(-2px, -2px) scale(1.04)";
            e.currentTarget.style.boxShadow = "7px 7px 0px #000000";
            e.currentTarget.style.backgroundColor = "#1A0000";
          }
        }}
        onMouseLeave={e => {
          if (!roaring) {
            e.currentTarget.style.transform = "translate(0, 0) scale(1)";
            e.currentTarget.style.boxShadow = "5px 5px 0px #000000";
            e.currentTarget.style.backgroundColor = "#0D0D0D";
          }
        }}
      >
        <Skull
          size={20}
          strokeWidth={2.8}
          color={roaring ? "#FFFFFF" : "#FF2200"}
          style={{
            animation: roaring ? "kaiju-btn-shake 0.1s infinite" : "none",
            filter: "drop-shadow(0 0 6px rgba(255,0,0,0.8))",
          }}
        />
        <span>{roaring ? "ROARING!!!" : "KAIJU"}</span>
      </button>

      {/* Fire particles canvas — permanently mounted so canvasRef is always ready */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99994,
          pointerEvents: "none",
          display: roaring ? "block" : "none",
        }}
      />

      {/* ── KAIJU OVERLAY ── */}
      <AnimatePresence>
        {roaring && (
          <>
            {/* Blood-Red / Obsidian Apocalypse Backdrop with Vignette */}
            <motion.div
              key="kaiju-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 99991,
                background: "radial-gradient(circle at center, rgba(140, 0, 0, 0.72) 0%, rgba(10, 0, 0, 0.94) 85%)",
                pointerEvents: "none",
              }}
            >
              {/* Scanline texture */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 4px)",
                  opacity: 0.7,
                }}
              />
            </motion.div>

            {/* Fullscreen Flexbox Container — GUARANTEES 100% DEAD-CENTER ALIGNMENT */}
            <div
              style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 99993,
                pointerEvents: "none",
              }}
            >
              <motion.div
                key="kaiju-head-motion"
                initial={{ scale: 0.2, opacity: 0, y: 150 }}
                animate={{
                  scale: [0.2, 1.3, 1.15, 1.2, 1.15],
                  opacity: 1,
                  y: [150, -10, 0, -5, 0],
                }}
                exit={{
                  scale: 0.1,
                  opacity: 0,
                  y: 120,
                  transition: { duration: 0.45, ease: "easeIn" },
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {/* Shake container — isolated from layout transforms */}
                <div
                  style={{
                    animation: "kaiju-violent-shake 0.08s infinite",
                    filter: "drop-shadow(0 0 60px #FF0000) drop-shadow(0 0 25px #000000)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DragonSkullSvg />
                </div>

                {/* Terrifying Glitch Typography */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: [0, 1, 0.8, 1, 0],
                    scale: [0.6, 1.4, 1.2, 1.3, 1],
                    y: [20, 0, -5, 0, 10],
                  }}
                  transition={{ duration: 2.2, times: [0, 0.15, 0.4, 0.7, 1] }}
                  style={{
                    position: "absolute",
                    bottom: "-45px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 900,
                    fontSize: "44px",
                    color: "#FF0000",
                    letterSpacing: "0.25em",
                    textShadow:
                      "4px 4px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 0 35px #FF0000, 0 0 70px #FF5500",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  ROAAAAARRRR!!!
                </motion.div>
              </motion.div>
            </div>

            {/* Atomic Breath Flash Overlay */}
            <motion.div
              key="kaiju-flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0.1, 0.7, 0, 0.4, 0] }}
              transition={{ duration: 1.2, times: [0, 0.08, 0.25, 0.4, 0.6, 0.75, 1] }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 99995,
                backgroundColor: "#FF1100",
                mixBlendMode: "color-dodge",
                pointerEvents: "none",
              }}
            />

            {/* Violent Kaiju Earthquake Shake Keyframes */}
            <style>{`
              @keyframes kaiju-violent-shake {
                0%   { transform: translate(-8px, 6px) rotate(-1.5deg); }
                15%  { transform: translate(10px, -8px) rotate(1.5deg); }
                30%  { transform: translate(-6px, 10px) rotate(-1.8deg); }
                45%  { transform: translate(12px, -4px) rotate(1deg); }
                60%  { transform: translate(-10px, 8px) rotate(-1.5deg); }
                75%  { transform: translate(6px, -10px) rotate(1.8deg); }
                90%  { transform: translate(-4px, 4px) rotate(-0.5deg); }
                100% { transform: translate(0px, 0px) rotate(0deg); }
              }
            `}</style>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes kaiju-btn-shake {
          0% { transform: translate(-1px, 1px) rotate(-1deg); }
          50% { transform: translate(1px, -1px) rotate(1deg); }
          100% { transform: translate(-1px, 1px) rotate(-1deg); }
        }
      `}</style>
    </>
  );
}
