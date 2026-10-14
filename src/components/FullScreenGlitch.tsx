"use client";

import { useState, useEffect, useRef } from "react";

// Fullscreen neo-brutalist glitch effect
export default function FullScreenGlitch() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [slicePos, setSlicePos] = useState({ top1: 25, top2: 65, top3: 45 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Sync status play
    const handlePlayState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying: boolean }>;
      setIsPlaying(Boolean(customEvent.detail?.isPlaying));
      if (!customEvent.detail?.isPlaying) {
        setIsGlitching(false);
      }
    };

    // Trigger glitch on beat
    const handleBeat = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying: boolean; isBeat: boolean }>;
      if (!customEvent.detail?.isPlaying || !customEvent.detail?.isBeat) return;

      setSlicePos({
        top1: Math.floor(Math.random() * 60) + 15,
        top2: Math.floor(Math.random() * 60) + 25,
        top3: Math.floor(Math.random() * 50) + 30,
      });

      setIsGlitching(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsGlitching(false);
      }, 90);
    };

    window.addEventListener("music-play-state", handlePlayState);
    window.addEventListener("music-beat", handleBeat);

    return () => {
      window.removeEventListener("music-play-state", handlePlayState);
      window.removeEventListener("music-beat", handleBeat);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!isPlaying) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99990] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.7) 50%)",
          backgroundSize: "100% 4px",
          willChange: "transform",
        }}
      />

      {/* Color flash */}
      <div
        className={`absolute inset-0 bg-[#00F0FF]/15 transition-opacity duration-75 pointer-events-none ${
          isGlitching ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "opacity" }}
      />

      {/* Glitch slices */}
      {isGlitching && (
        <>
          <div
            className="absolute left-0 right-0 h-[5px] sm:h-[8px] bg-[#00F0FF] border-y-2 border-black shadow-[0_1px_0_#000]"
            style={{
              top: `${slicePos.top1}%`,
              transform: "translate3d(0, 0, 0)",
            }}
          />

          <div
            className="absolute left-0 right-0 h-[4px] sm:h-[6px] bg-[#FF0055] border-y-2 border-black shadow-[0_1px_0_#000]"
            style={{
              top: `${slicePos.top2}%`,
              transform: "translate3d(0, 0, 0)",
            }}
          />

          <div
            className="absolute left-[10%] w-[80%] h-[3px] bg-[#FFB800] border-y border-black"
            style={{
              top: `${slicePos.top3}%`,
              transform: "translate3d(0, 0, 0)",
            }}
          />
        </>
      )}

      {/* Screen border */}
      <div
        className={`absolute inset-0 border-[3px] transition-colors duration-75 pointer-events-none ${
          isGlitching ? "border-[#FF0055] opacity-70" : "border-transparent opacity-0"
        }`}
        style={{ willChange: "opacity, border-color" }}
      />

      {/* Corner badge */}
      <div className="absolute top-20 right-4 sm:right-6 flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-black/85 backdrop-blur-sm border-2 border-black text-white font-mono text-[9px] sm:text-[10px] shadow-[2px_2px_0px_#FF5C00]">
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            isGlitching ? "bg-[#FF0055] scale-125" : "bg-[#22C55E]"
          }`}
        />
        <span className="font-bold tracking-widest text-neutral-200">
          {isGlitching ? "⚡ GLITCH BEAT" : "FM 88.7 SHELTER"}
        </span>
      </div>
    </div>
  );
}
