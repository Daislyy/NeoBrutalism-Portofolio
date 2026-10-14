"use client";

import { motion } from "framer-motion";

interface GlitchBeatVisualizerProps {
  isPlaying: boolean;
  bassLevel: number; // 0 to 1
  isBeat: boolean;
  frequencyData?: number[]; // array of normalized freq values 0 to 1
}

// Visualizer beat & audio equalizer
export default function GlitchBeatVisualizer({
  isPlaying,
  bassLevel,
  isBeat,
  frequencyData = [0.2, 0.4, 0.6, 0.3, 0.5, 0.7, 0.4],
}: GlitchBeatVisualizerProps) {
  const barColors = [
    "#FF5C00",
    "#FFB800",
    "#22C55E",
    "#C084FC",
    "#00F0FF",
    "#FF0055",
    "#FFD600",
  ];

  return (
    <div className="relative flex items-center justify-between gap-2 px-3 py-2 rounded-[12px] bg-white border-2 border-black shadow-[2px_2px_0px_#000] overflow-hidden select-none">
      {/* Scanline flash */}
      {isPlaying && isBeat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.25, 0] }}
          transition={{ duration: 0.1 }}
          className="absolute inset-0 bg-[#00F0FF] pointer-events-none mix-blend-difference"
        />
      )}

      {/* Status badge */}
      <div className="flex items-center gap-1.5 z-10">
        <span
          className={`w-2 h-2 rounded-full border border-black transition-colors ${
            isPlaying
              ? isBeat
                ? "bg-[#FF0055] scale-125"
                : "bg-[#22C55E]"
              : "bg-neutral-300"
          }`}
        />
        <span className="font-mono text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-black">
          {isPlaying ? (isBeat ? "⚡ BASS KICK" : "BEAT SYNC") : "AUDIO PAUSED"}
        </span>
      </div>

      {/* Equalizer bars */}
      <div className="flex items-end gap-1 h-5 z-10">
        {barColors.map((color, index) => {
          const freqVal = frequencyData[index] || 0.15;
          const dynamicHeight = isPlaying
            ? Math.max(15, Math.min(100, Math.round(freqVal * 100 * (isBeat ? 1.3 : 1))))
            : 20;

          return (
            <motion.div
              key={index}
              animate={{
                height: `${dynamicHeight}%`,
                scaleY: isPlaying && isBeat ? [1, 1.15, 1] : 1,
              }}
              transition={{
                duration: 0.08,
                ease: "easeOut",
              }}
              className="w-1.5 sm:w-2 rounded-t-[3px] border border-black shadow-[1px_1px_0px_#000]"
              style={{
                backgroundColor: isPlaying && isBeat && index % 2 === 0 ? "#FF0055" : color,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
