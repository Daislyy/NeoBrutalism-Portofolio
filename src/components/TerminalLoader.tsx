"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLoaderProps {
  onComplete: () => void;
}

const terminalLogs = [
  { prefix: "[SYS]", text: "BIOS://PADLY_NEOBRUTALISM_ROM v1.0", color: "#FF5C00", delay: 200 },
  { prefix: "[CPU]", text: "CREATIVE_PROCESSOR: 8-CORE DESIGN ENGINE (OK)", color: "#FFB800", delay: 450 },
  { prefix: "[MEM]", text: "ALLOCATING 32GB IMAGINATION_BUFFER... OK", color: "#FFB800", delay: 700 },
  { prefix: "[GPU]", text: "RENDERER: BRUTALIST_VECTOR_PIPELINE (OK)", color: "#FF5C00", delay: 950 },
  { prefix: "[NET]", text: "CONNECTING TO CREATIVE_NETWORK... LINKED", color: "#C084FC", delay: 1250 },
  { prefix: "[DB]", text: "MOUNTING PROJECT_DATABASE & REPOS... OK", color: "#FFB800", delay: 1550 },
  { prefix: "[UI]", text: "INJECTING NEOBRUTALIST SHADERS... SUCCESS", color: "#FF5C00", delay: 1850 },
  { prefix: "[OK]", text: "ALL SYSTEMS NOMINAL. LAUNCHING INTERFACE...", color: "#22c55e", delay: 2150 },
];

const statusMessages = [
  { threshold: 0, text: "padly@brutalist-core:~$ ./boot_system.sh" },
  { threshold: 25, text: "padly@brutalist-core:~$ loading_modules... [OK]" },
  { threshold: 50, text: "padly@brutalist-core:~$ compiling_assets... [OK]" },
  { threshold: 75, text: "padly@brutalist-core:~$ rendering_ui... [98%]" },
  { threshold: 98, text: "padly@brutalist-core:~$ launching_portfolio... [100%]" },
];

export default function TerminalLoader({ onComplete }: TerminalLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<typeof terminalLogs>([]);
  const [statusText, setStatusText] = useState(statusMessages[0].text);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleSkip = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
  }, [isExiting]);

  // Log typewriter effect
  useEffect(() => {
    const timeouts = terminalLogs.map((log) =>
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, log.delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const jump = Math.floor(Math.random() * 4) + 2;
        const next = Math.min(prev + jump, 100);

        // Update status text
        for (let i = statusMessages.length - 1; i >= 0; i--) {
          if (next >= statusMessages[i].threshold) {
            setStatusText(statusMessages[i].text);
            break;
          }
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Auto-exit when progress hits 100
  useEffect(() => {
    if (progress === 100 && !isExiting) {
      const timer = setTimeout(() => setIsExiting(true), 400);
      return () => clearTimeout(timer);
    }
  }, [progress, isExiting]);

  // When exit animation completes
  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isExiting, onComplete]);

  // ESC to skip
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSkip]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="terminal-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FBF9F5] dark:bg-[#20242D] transition-colors"
          onClick={handleSkip}
        >
          {/* Neo-brutalist terminal window */}
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-[92%] max-w-[680px] select-none cursor-pointer"
          >
            {/* Terminal container */}
            <div
              style={{
                border: "2.5px solid #000",
                boxShadow: "6px 6px 0px #000",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#1a1a1a",
              }}
            >
              {/* Title bar */}
              <div
                style={{
                  backgroundColor: "#FFB800",
                  borderBottom: "2.5px solid #000",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {/* Traffic light dots */}
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: "#FF5C00",
                      border: "2px solid #000",
                    }}
                  />
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: "#FFD600",
                      border: "2px solid #000",
                    }}
                  />
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                      border: "2px solid #000",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-fredoka), cursive, sans-serif",
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "#000",
                    letterSpacing: "0.05em",
                  }}
                >
                  padly@brutalist-core — boot
                </span>
                <div style={{ width: "54px" }} /> {/* Spacer for centering */}
              </div>

              {/* Terminal body */}
              <div
                style={{
                  padding: "20px",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: "13px",
                  lineHeight: "1.7",
                  color: "#e0e0e0",
                  minHeight: "280px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* ASCII art header */}
                <div style={{ marginBottom: "16px" }}>
                  <pre
                    style={{
                      fontSize: "10px",
                      lineHeight: "1.3",
                      color: "#FFB800",
                      fontFamily: "'Courier New', Courier, monospace",
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
{`
 ██████╗  █████╗ ██████╗ ██╗  ██╗   ██╗
 ██╔══██╗██╔══██╗██╔══██╗██║  ╚██╗ ██╔╝
 ██████╔╝███████║██║  ██║██║   ╚████╔╝ 
 ██╔═══╝ ██╔══██║██║  ██║██║    ╚██╔╝  
 ██║     ██║  ██║██████╔╝███████╗██║   
 ╚═╝     ╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝   
`}
                  </pre>
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "11px",
                      color: "#FF5C00",
                      letterSpacing: "0.3em",
                      fontWeight: "bold",
                      marginTop: "2px",
                    }}
                  >
                    ═══ NEOBRUTALIST SYSTEM CORE ═══
                  </div>
                </div>

                {/* Separator */}
                <div
                  style={{
                    borderTop: "1px dashed #444",
                    margin: "4px 0 12px 0",
                  }}
                />

                {/* Log lines */}
                <div style={{ flex: 1, marginBottom: "16px" }}>
                  {logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        marginBottom: "3px",
                      }}
                    >
                      <span
                        style={{
                          color: "#666",
                          fontWeight: "bold",
                          flexShrink: 0,
                          fontSize: "12px",
                        }}
                      >
                        {log.prefix}
                      </span>
                      <span style={{ color: log.color, fontSize: "12px" }}>
                        {log.text}
                      </span>
                    </motion.div>
                  ))}

                  {/* Blinking cursor */}
                  {logs.length < terminalLogs.length && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                      <span style={{ color: "#FFB800", fontWeight: "bold" }}>&gt;</span>
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "14px",
                          backgroundColor: "#FFB800",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div
                  style={{
                    borderTop: "1px dashed #444",
                    margin: "0 0 12px 0",
                  }}
                />

                {/* Status text */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "11px",
                    color: "#aaa",
                    marginBottom: "8px",
                  }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {statusText}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontWeight: "bold",
                      color: "#FFB800",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    {progress}%
                  </span>
                </div>

                {/* Progress bar — neo-brutalist style */}
                <div
                  style={{
                    border: "2.5px solid #000",
                    borderRadius: "8px",
                    backgroundColor: "#2a2a2a",
                    height: "28px",
                    padding: "3px",
                    boxShadow: "3px 3px 0px #000",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      borderRadius: "5px",
                      background: "linear-gradient(90deg, #FFB800, #FF5C00)",
                      width: `${progress}%`,
                    }}
                    transition={{ duration: 0.08, ease: "linear" }}
                  />
                </div>

                {/* Skip hint */}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "12px",
                    fontSize: "10px",
                    color: "#555",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  press{" "}
                  <span
                    style={{
                      backgroundColor: "#333",
                      color: "#FFB800",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      border: "1.5px solid #555",
                      fontWeight: "bold",
                      fontSize: "11px",
                    }}
                  >
                    ESC
                  </span>{" "}
                  or click anywhere to skip
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        /* Exit animation — smooth vertical collapse + fade */
        <motion.div
          key="terminal-exit"
          initial={{ opacity: 1, scaleY: 1 }}
          animate={{
            opacity: 0,
            scaleY: 0.01,
            filter: "brightness(2)",
          }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FBF9F5] dark:bg-[#20242D]"
          style={{
            transformOrigin: "center center",
          }}
        />
      )}
    </AnimatePresence>
  );
}
