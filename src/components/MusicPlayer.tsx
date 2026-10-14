"use client";

import { useState, useRef, useEffect } from "react";

const TRACK = {
  title: "Shelter",
  artist: "Porter Robinson & Madeon",
  album: "SHELTER EP - 2016",
  duration: 338,
};

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [elapsed, setElapsed] = useState(138); // start at 2:18 like the design
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= TRACK.duration) {
            if (isRepeat) return 0;
            setIsPlaying(false);
            return TRACK.duration;
          }
          return e + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isRepeat]);

  const progress = elapsed / TRACK.duration;

  return (
    <div className="relative">
      <div
        className="absolute inset-0 rounded-[24px] translate-x-[8px] translate-y-[8px]"
        style={{ backgroundColor: "#FFB800", border: "2.5px solid #000" }}
      />
      <div
        className="relative w-[480px] rounded-[24px] p-5 flex flex-col gap-2.5"
        style={{
          backgroundColor: "#FFECC7",
          border: "2.5px solid #000000",
          fontFamily: "var(--font-fredoka), cursive, sans-serif",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: "#141414" }}
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: "#22C55E" }}
            />
            FM 88.7 SHELTER RADIO
          </span>
        </div>

        <div>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px]"
            style={{
              backgroundColor: "#FFD600",
              color: "#141414",
              border: "1.5px solid #000",
            }}
          >
            <span style={{ color: "#FF5C00" }}>▶</span> NOW PLAYING
          </span>
        </div>

        <div className="mt-0">
          <h3 className="text-[38px] font-bold text-[#141414] leading-[1]">
            {TRACK.title}
          </h3>
          <p className="text-[15px] font-medium text-[#6B7280] mt-1">
            {TRACK.artist}
          </p>
        </div>

        <div>
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px]"
            style={{
              backgroundColor: "#FFD600",
              color: "#141414",
              border: "1.5px solid #000",
            }}
          >
            🎵 {TRACK.album}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div
            className="w-full h-[6px] rounded-full overflow-hidden cursor-pointer"
            style={{ backgroundColor: "#D1D5DB" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              setElapsed(Math.floor(ratio * TRACK.duration));
            }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress * 100}%`, backgroundColor: "#141414" }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#6B7280] font-medium">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(TRACK.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-0">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            aria-label="Shuffle"
            className="w-10 h-10 rounded-[12px] flex items-center justify-center transition-all active:translate-y-[1px] active:shadow-none cursor-pointer"
            style={{
              backgroundColor: isShuffle ? "#FFD600" : "#fff",
              border: "2px solid #000",
              boxShadow: "2px 2px 0 0 #000",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </button>

          <button
            aria-label="Previous"
            className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center transition-all active:translate-y-[1px] active:shadow-none cursor-pointer"
            style={{ border: "2px solid #000", boxShadow: "2px 2px 0 #000" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#141414" stroke="none">
              <polygon points="19,20 9,12 19,4" />
              <line x1="5" y1="4" x2="5" y2="20" stroke="#141414" strokeWidth="3" />
            </svg>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all active:translate-y-[1px] active:shadow-none cursor-pointer"
            style={{
              backgroundColor: "#141414",
              border: "2px solid #000",
              boxShadow: "3px 3px 0 #FFB800",
            }}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
          </button>

          <button
            aria-label="Next"
            className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center transition-all active:translate-y-[1px] active:shadow-none cursor-pointer"
            style={{ border: "2px solid #000", boxShadow: "2px 2px 0 #000" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#141414" stroke="none">
              <polygon points="5,4 15,12 5,20" />
              <line x1="19" y1="4" x2="19" y2="20" stroke="#141414" strokeWidth="3" />
            </svg>
          </button>

          <button
            onClick={() => setIsRepeat(!isRepeat)}
            aria-label="Repeat"
            className="w-10 h-10 rounded-[12px] flex items-center justify-center transition-all active:translate-y-[1px] active:shadow-none cursor-pointer"
            style={{
              backgroundColor: isRepeat ? "#C084FC" : "#fff",
              border: "2px solid #000",
              boxShadow: "2px 2px 0 0 #000",
              color: isRepeat ? "#fff" : "#141414",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isRepeat ? "#fff" : "#141414"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
