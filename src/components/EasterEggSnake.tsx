"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Skull, AlertTriangle } from "lucide-react";

// ─── Config — GEDE & KENCENG ─────────────────────────────────────────────────
const PIXEL       = 26;
const BASE_SPEED  = 5.5;
const MAX_SPEED   = 14;
const BODY_LENGTH = 42;
const TURN_RATE   = 40;
const RAGE_ACCEL  = 0.012;

const RAGE_COLORS = [
  "#FF0000", "#FF2200", "#FF4400",
  "#FF5C00", "#FF2200", "#FF0000",
  "#CC0000", "#FF4400", "#FF0000",
  "#FF2200", "#CC0000", "#FF5C00",
  "#FF0000", "#FF2200", "#880000",
  "#FF4400", "#FF0000", "#CC0000",
  "#880000", "#FF2200", "#FF0000",
  "#CC0000", "#FF5C00", "#880000",
  "#FF0000", "#CC0000", "#880000",
  "#550000", "#440000", "#330000",
  "#220000", "#111100", "#000000",
  "#1a0000", "#000000", "#1a0000",
  "#000000", "#111100", "#220000",
  "#330000", "#440000", "#550000",
];

interface Pt { x: number; y: number; }
interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}

// ─── Web Audio helpers ────────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
}

/** Hissing white-noise loop — returns a StopFn */
function startHiss(volume = 0.18): () => void {
  const ctx = getAudioCtx();
  const bufSize = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);

  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;

  // Band-pass → sounds like a snake hiss
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 3800;
  bp.Q.value = 0.6;

  // Gain with slow fade-in
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.8);

  src.connect(bp).connect(gain).connect(ctx.destination);
  src.start();

  return () => {
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    setTimeout(() => { try { src.stop(); } catch (_) {} }, 500);
  };
}

/** Jump-scare boom — loud sudden noise */
function playJumpScare() {
  const ctx = getAudioCtx();

  // Low-freq BOOM
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.6);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(1.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.7);

  // High screechy layer
  const osc2 = ctx.createOscillator();
  osc2.type = "square";
  osc2.frequency.setValueAtTime(1200, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.35);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.6, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc2.connect(gain2).connect(ctx.destination);
  osc2.start();
  osc2.stop(ctx.currentTime + 0.4);

  // Noise burst
  const bufSize = ctx.sampleRate * 0.3;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
  const ns = ctx.createBufferSource();
  ns.buffer = buf;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.9, ctx.currentTime);
  ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  ns.connect(ng).connect(ctx.destination);
  ns.start();
}

/** Short wall-bounce thud */
function playBounce() {
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(140, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.55, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

// ─── Spark helper ─────────────────────────────────────────────────────────────
function spawnSparks(x: number, y: number, sparks: Spark[]) {
  for (let i = 0; i < 6; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd   = 2 + Math.random() * 4;
    sparks.push({
      x, y,
      vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
      life: 0, maxLife: 18 + Math.random() * 14,
      color: ["#FF0000","#FF5C00","#FFB800"][Math.floor(Math.random()*3)],
      size: 3 + Math.random() * 5,
    });
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EasterEggSnake() {
  const [phase, setPhase]     = useState<"idle"|"shaking"|"active">("idle");
  const canvasRef             = useRef<HTMLCanvasElement>(null);
  const rafRef                = useRef<number>(0);
  const bodyRef               = useRef<Pt[]>([]);
  const velRef                = useRef<Pt>({ x: BASE_SPEED, y: 0 });
  const speedRef              = useRef(BASE_SPEED);
  const frameRef              = useRef(0);
  const sparksRef             = useRef<Spark[]>([]);
  const shakeRef              = useRef({ x: 0, y: 0 });
  const stopHissRef           = useRef<(() => void) | null>(null);
  const lastBounceFrameRef    = useRef(0);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stopHissRef.current?.();
    stopHissRef.current = null;
    setPhase("idle");
    bodyRef.current   = [];
    sparksRef.current = [];
    speedRef.current  = BASE_SPEED;
    frameRef.current  = 0;
  }, []);

  // Egg click → shake → hatch
  const handleEggClick = useCallback(() => {
    setPhase("shaking");
    // Rattle sound while shaking
    const rattle = startHiss(0.05);
    setTimeout(() => {
      rattle();
      playJumpScare();     // BOOM on hatch
      setPhase("active");
    }, 1100);
  }, []);

  // Main rage loop
  useEffect(() => {
    if (phase !== "active") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const cx = Math.floor(window.innerWidth  / 2);
    const cy = Math.floor(window.innerHeight / 2);
    bodyRef.current   = Array.from({ length: BODY_LENGTH }, () => ({ x: cx, y: cy }));
    velRef.current    = { x: BASE_SPEED, y: 0 };
    speedRef.current  = BASE_SPEED;
    frameRef.current  = 0;
    sparksRef.current = [];

    // Start continuous hiss
    stopHissRef.current = startHiss(0.22);

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const body = bodyRef.current, sparks = sparksRef.current;
      let vel = velRef.current, spd = speedRef.current;

      frameRef.current++;

      spd = Math.min(spd + RAGE_ACCEL, MAX_SPEED);
      speedRef.current = spd;

      const rageLevel = (spd - BASE_SPEED) / (MAX_SPEED - BASE_SPEED);
      const shakeMag  = rageLevel * 6;
      shakeRef.current = { x: (Math.random()-.5)*shakeMag, y: (Math.random()-.5)*shakeMag };

      const head   = body[0];
      const margin = PIXEL * 2;
      const hitL = head.x <= margin,   hitR = head.x >= w - margin - PIXEL;
      const hitT = head.y <= margin,   hitB = head.y >= h - margin - PIXEL;

      if (hitL || hitR) {
        vel = { x: -vel.x, y: vel.y };
        spawnSparks(head.x, head.y, sparks);
        // Throttle bounce sound so it doesn't overlap too fast
        if (frameRef.current - lastBounceFrameRef.current > 8) {
          playBounce(); lastBounceFrameRef.current = frameRef.current;
        }
      }
      if (hitT || hitB) {
        vel = { x: vel.x, y: -vel.y };
        spawnSparks(head.x, head.y, sparks);
        if (frameRef.current - lastBounceFrameRef.current > 8) {
          playBounce(); lastBounceFrameRef.current = frameRef.current;
        }
      }

      const dynTurn = Math.max(10, TURN_RATE - Math.floor(rageLevel * 25));
      if (frameRef.current % dynTurn === 0) {
        const r    = Math.random();
        const norm = Math.sqrt(vel.x**2 + vel.y**2);
        if      (r < 0.45) vel = { x: -vel.y/norm*spd, y:  vel.x/norm*spd };
        else if (r < 0.70) vel = { x:  vel.y/norm*spd, y: -vel.x/norm*spd };
        else if (r < 0.82) {
          const dirs = [{x:spd,y:0},{x:-spd,y:0},{x:0,y:spd},{x:0,y:-spd}];
          vel = dirs[Math.floor(Math.random()*4)];
        }
      }

      const mag = Math.sqrt(vel.x**2+vel.y**2);
      if (mag > 0) vel = { x: vel.x/mag*spd, y: vel.y/mag*spd };
      velRef.current = vel;

      const nx = Math.max(margin, Math.min(w-margin-PIXEL, head.x+vel.x));
      const ny = Math.max(margin, Math.min(h-margin-PIXEL, head.y+vel.y));
      body.unshift({ x: nx, y: ny });
      if (body.length > BODY_LENGTH) body.pop();
      if (frameRef.current % 8 === 0) spawnSparks(nx, ny, sparks);

      // ── Draw ────────────────────────────────────────────────────────────────
      ctx.save();
      ctx.translate(shakeRef.current.x, shakeRef.current.y);
      ctx.clearRect(-10, -10, w+20, h+20);

      const auraGrad = ctx.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,h*.85);
      auraGrad.addColorStop(0, "rgba(0,0,0,0)");
      auraGrad.addColorStop(1, `rgba(180,0,0,${0.08+rageLevel*.28})`);
      ctx.fillStyle = auraGrad; ctx.fillRect(-10,-10,w+20,h+20);

      // Sparks
      for (let i = sparks.length-1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x+=sp.vx; sp.y+=sp.vy; sp.vy+=.15; sp.life++;
        if (sp.life >= sp.maxLife) { sparks.splice(i,1); continue; }
        ctx.save();
        ctx.globalAlpha = 1-sp.life/sp.maxLife;
        ctx.fillStyle = sp.color; ctx.strokeStyle="#000"; ctx.lineWidth=1;
        ctx.beginPath(); ctx.rect(sp.x-sp.size/2,sp.y-sp.size/2,sp.size,sp.size);
        ctx.fill(); ctx.stroke(); ctx.restore();
      }

      // Body & Head Rendering
      for (let i = body.length - 1; i >= 0; i--) {
        const t = i / (body.length - 1);
        const color = RAGE_COLORS[Math.min(i, RAGE_COLORS.length - 1)];
        const size  = PIXEL - PIXEL * 0.45 * t;
        const isTail = i === body.length - 1;

        // Calculate segment angle along spine
        let segAngle = 0;
        if (i === 0) {
          segAngle = Math.atan2(vel.y, vel.x);
        } else {
          const dx = body[i - 1].x - body[i].x;
          const dy = body[i - 1].y - body[i].y;
          segAngle = Math.atan2(dy, dx);
        }

        ctx.save();
        ctx.translate(body[i].x, body[i].y);
        ctx.rotate(segAngle);
        ctx.globalAlpha = 1 - t * 0.35;

        if (i === 0) {
          // ─── GIANT RAGE VIPER HEAD ─────────────────────────────────
          const tongueFlick = 12 + Math.sin(frameRef.current * 0.8) * 8 + rageLevel * 6;
          const waggle = Math.sin(frameRef.current * 1.2) * 2.5;

          // 1. Long Forked Venom Tongue (darts out from snout tip +20)
          ctx.save();
          ctx.strokeStyle = "#FF1A1A";
          ctx.shadowColor = "#FF0000";
          ctx.shadowBlur = 12 + rageLevel * 14;
          ctx.lineWidth = 2.6;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          const stemStart = 18;
          const stemEnd = stemStart + tongueFlick * 0.65;
          const tipEnd = stemStart + tongueFlick;
          const forkW = 5 + rageLevel * 2;

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

          // 2. Head Silhouette (Viper spade geometry with wide venom glands)
          ctx.save();
          ctx.shadowColor = "#FF0000";
          ctx.shadowBlur = 16 + rageLevel * 26;

          ctx.beginPath();
          // Neck connection
          ctx.moveTo(-16, -7);
          // Wide flared venom gland cheeks
          ctx.bezierCurveTo(-14, -15, -7, -17.5, -2, -17);
          // Jawline tapering towards eyes
          ctx.bezierCurveTo(4, -16.5, 9, -14, 13, -10);
          // Tapered snout
          ctx.bezierCurveTo(17, -7.5, 20, -5, 23, -2.5);
          // Blunt rounded rostral apex (tip of snout)
          ctx.quadraticCurveTo(24.5, 0, 23, 2.5);
          // Lower snout
          ctx.bezierCurveTo(20, 5, 17, 7.5, 13, 10);
          // Lower jawline
          ctx.bezierCurveTo(9, 14, 4, 16.5, -2, 17);
          // Lower venom gland
          ctx.bezierCurveTo(-7, 17.5, -14, 15, -16, 7);
          // Neck joint
          ctx.quadraticCurveTo(-18, 0, -16, -7);
          ctx.closePath();

          ctx.fillStyle = color;
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 3.2;
          ctx.lineJoin = "round";
          ctx.stroke();

          // 3. Backward-curving lethal Viper Fangs
          ctx.fillStyle = "#FFFFFF";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 1.6;
          [-1, 1].forEach((sign) => {
            ctx.beginPath();
            const fx = 12;
            const fy = sign * 9.5;
            ctx.moveTo(fx, fy);
            // Fang curves backward and inward
            ctx.quadraticCurveTo(fx + 2, fy + sign * 5, fx - 4, fy + sign * 7.5);
            ctx.quadraticCurveTo(fx - 1, fy + sign * 4, fx - 1.5, fy);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          });

          // 4. Crown Scales / Dorsal Armor Plates
          ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 1.8;

          // Main crown diamond (frontal/parietal shield)
          ctx.beginPath();
          ctx.moveTo(-10, 0);
          ctx.lineTo(-3, -6);
          ctx.lineTo(5, -4.5);
          ctx.lineTo(9, 0);
          ctx.lineTo(5, 4.5);
          ctx.lineTo(-3, 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Midline canthus rostralis ridge to snout tip
          ctx.beginPath();
          ctx.moveTo(9, 0);
          ctx.lineTo(20, 0);
          ctx.stroke();

          // Sensory pits & nostrils near snout tip
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(18, -3.8, 1.4, 0, Math.PI * 2);
          ctx.arc(18, 3.8, 1.4, 0, Math.PI * 2);
          ctx.fill();

          // 5. Predatory Glowing Eyes with Slit Pupils
          const renderRageEye = (sign: number) => {
            const ex = 5;
            const ey = sign * 10.5;

            ctx.save();
            ctx.translate(ex, ey);
            ctx.rotate(sign * 0.28);

            // Fiery sclera with yellow/amber glow
            ctx.beginPath();
            ctx.ellipse(0, 0, 5.2, 3.4, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#FFCC00";
            ctx.fill();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Inner crimson iris ring
            ctx.beginPath();
            ctx.ellipse(0, 0, 3.6, 2.6, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#FF2200";
            ctx.fill();

            // Razor-sharp vertical reptilian slit pupil
            ctx.beginPath();
            ctx.moveTo(0, -3.2);
            ctx.quadraticCurveTo(1.2, 0, 0, 3.2);
            ctx.quadraticCurveTo(-1.2, 0, 0, -3.2);
            ctx.fillStyle = "#000000";
            ctx.fill();

            // Glint specular dot
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(-1.1, -1.4, 1.1, 1.1);

            ctx.restore();

            // Heavy armored supraocular brow scale ridge
            ctx.beginPath();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2.8;
            ctx.lineCap = "round";
            ctx.moveTo(ex - 5.5, ey - sign * 3.8);
            ctx.lineTo(ex + 5.5, ey - sign * 2.4);
            ctx.stroke();
          };

          renderRageEye(-1);
          renderRageEye(1);

          ctx.restore();
        } else {
          // ─── INTERLOCKING SERPENTINE SCALE SEGMENTS ────────────────
          const half = size / 2;
          const len = size * 0.8;

          ctx.fillStyle = color;
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = i < 6 ? 2.4 : 1.8;
          ctx.lineJoin = "round";

          if (i < 5) {
            ctx.shadowColor = "#FF2200";
            ctx.shadowBlur = 6;
          } else {
            ctx.shadowColor = "#000000";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
          }

          ctx.beginPath();
          if (isTail) {
            // Lethal tail rattle / stinger barb
            ctx.moveTo(len * 0.6, 0);
            ctx.lineTo(0, -half * 0.6);
            ctx.lineTo(-len * 1.8, 0);
            ctx.lineTo(0, half * 0.6);
          } else {
            // Hexagonal dorsal scute scale
            ctx.moveTo(len, 0);
            ctx.lineTo(len * 0.4, -half);
            ctx.lineTo(-len * 0.75, -half * 0.9);
            ctx.lineTo(-len, 0);
            ctx.lineTo(-len * 0.75, half * 0.9);
            ctx.lineTo(len * 0.4, half);
          }
          ctx.closePath();
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.stroke();

          // Dorsal ridge spine accent
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
          ctx.lineWidth = 1.4;
          ctx.moveTo(len * 0.6, 0);
          ctx.lineTo(-len * 0.6, 0);
          ctx.stroke();
        }

        ctx.restore();
      }

      // RAGE HUD
      ctx.save(); ctx.globalAlpha=.85;
      const hudW=220,hudH=34,hudX=14,hudY=h-52;
      ctx.fillStyle="#000"; ctx.strokeStyle="#FF0000"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.roundRect(hudX,hudY,hudW,hudH,4); ctx.fill(); ctx.stroke();
      ctx.fillStyle=`hsl(${20-rageLevel*20},100%,${50-rageLevel*15}%)`;
      ctx.beginPath(); ctx.roundRect(hudX+4,hudY+10,(hudW-8)*rageLevel,14,2); ctx.fill();
      ctx.fillStyle="#FF0000"; ctx.font=`bold 9px 'Courier New',monospace`; ctx.fillText("RAGE",hudX+6,hudY+9);
      ctx.fillStyle="#fff"; ctx.font=`bold 10px 'Courier New',monospace`;
      ctx.fillText(`${Math.round(spd*10)/10}px/f — ESC to run`,hudX+6,hudY+28);
      ctx.restore();

      ctx.restore(); // end shake
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const onKey = (e: KeyboardEvent) => { if (e.key==="Escape") stop(); };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      stopHissRef.current?.();
      stopHissRef.current = null;
    };
  }, [phase, stop]);

  return (
    <>
      {/* Canvas */}
      {phase==="active" && (
        <canvas ref={canvasRef} style={{position:"fixed",inset:0,zIndex:99990,pointerEvents:"none"}}/>
      )}

      {/* Dismiss button */}
      {phase==="active" && (
        <button
          onClick={stop}
          title="ESC to escape"
          style={{
            position:"fixed", bottom:"88px", right:"20px",
            zIndex:99997, width:"44px", height:"44px",
            border:"3px solid #000", borderRadius:"8px",
            boxShadow:"4px 4px 0 #000",
            backgroundColor:"#FF0000", color:"#fff",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"none", transition:"transform 0.1s, box-shadow 0.1s",
            animation:"rage-pulse 0.4s infinite alternate",
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translate(-3px,-3px)";e.currentTarget.style.boxShadow="7px 7px 0 #000";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translate(0,0)";e.currentTarget.style.boxShadow="4px 4px 0 #000";}}
        >
          <X size={22} strokeWidth={3}/>
        </button>
      )}

      {/* Idle egg */}
      {phase==="idle" && (
        <div
          onClick={handleEggClick}
          title="klik kalau berani..."
          style={{
            position:"fixed", bottom:"20px", right:"20px",
            zIndex:99997, width:"60px", height:"72px",
            cursor:"none", display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", userSelect:"none",
            transition:"transform 0.15s cubic-bezier(.34,1.56,.64,1)",
          }}
          onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.18) rotate(-8deg)")}
          onMouseLeave={e=>(e.currentTarget.style.transform="scale(1) rotate(0deg)")}
        >
          <svg width="48" height="58" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="25" cy="51" rx="14" ry="4" fill="#000" opacity="0.25"/>
            <path d="M22 2C13 2 4 16 4 30C4 42 12 52 22 52C32 52 40 42 40 30C40 16 31 2 22 2Z"
              fill="#FFECC7" stroke="#000" strokeWidth="2.5"/>
            <path d="M22 14 L19 20 L23 25 L18 32" stroke="#FF5C00" strokeWidth="2" strokeLinecap="square"/>
            <path d="M23 25 L27 28" stroke="#FF5C00" strokeWidth="2" strokeLinecap="square"/>
            <rect x="14" y="30" width="4" height="4" fill="#FFB800" stroke="#000" strokeWidth="1"/>
            <rect x="26" y="38" width="4" height="4" fill="#FFB800" stroke="#000" strokeWidth="1"/>
          </svg>
          <span style={{fontSize:"9px",fontFamily:"'Courier New',monospace",fontWeight:700,color:"#000",letterSpacing:"0.08em",marginTop:"2px",opacity:0.55}}>
            psst...
          </span>
        </div>
      )}

      {/* Shaking egg — pre-hatch */}
      {phase==="shaking" && (
        <div style={{
          position:"fixed", bottom:"20px", right:"20px",
          zIndex:99997, width:"60px", height:"72px",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          animation:"egg-rage 0.1s infinite",
          pointerEvents:"none",
        }}>
          <svg width="56" height="68" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2C13 2 4 16 4 30C4 42 12 52 22 52C32 52 40 42 40 30C40 16 31 2 22 2Z"
              fill="#FF5C00" stroke="#000" strokeWidth="2.5"/>
            <path d="M16 10 L20 18 L15 24 L19 30 L14 38" stroke="#000" strokeWidth="2" strokeLinecap="square"/>
            <path d="M26 14 L30 22 L25 28" stroke="#000" strokeWidth="2" strokeLinecap="square"/>
            <path d="M20 18 L26 14" stroke="#000" strokeWidth="2" strokeLinecap="square"/>
          </svg>
          {/* Skull icon instead of emoji */}
          <div style={{marginTop:"2px",color:"#FF0000",animation:"egg-rage 0.08s infinite"}}>
            <Skull size={16} strokeWidth={2.5}/>
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes egg-rage {
          0%   { transform: translate(-3px,-2px) rotate(-5deg); }
          25%  { transform: translate(3px,2px) rotate(5deg); }
          50%  { transform: translate(-2px,3px) rotate(-3deg); }
          75%  { transform: translate(2px,-3px) rotate(4deg); }
          100% { transform: translate(-3px,1px) rotate(-6deg); }
        }
        @keyframes rage-pulse {
          from { box-shadow: 4px 4px 0 #000, 0 0 0 #FF0000; }
          to   { box-shadow: 4px 4px 0 #000, 0 0 14px #FF0000; }
        }
      `}</style>
    </>
  );
}
