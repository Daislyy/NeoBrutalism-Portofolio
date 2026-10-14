"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

function InstagramIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path
        d="M14.5 8h-2a2 2 0 0 0-2 2v2H9v2.5h1.5V21h3v-6.5h2l.5-2.5h-2.5v-1.5a.5.5 0 0 1 .5-.5h2V8z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function GithubIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function YoutubeIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function DiscordIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function About() {
  const [copied, setCopied] = useState(false);
  const email = "dlyy.dev@gmail.com";

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="about"
      className="w-full max-w-[1104px] mx-auto px-6 pt-4 pb-24"
      style={{ fontFamily: "var(--font-fredoka), cursive, sans-serif" }}
    >
      {/* Outer Card Container with Framer Motion scroll entrance */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="w-full rounded-[32px] border-[2.5px] border-black bg-[#FBF9F5] p-6 sm:p-9 md:p-11 lg:p-12 shadow-[6px_6px_0px_#000]"
      >
        {/* Top Badge: About Me */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
          className="mb-7 sm:mb-8"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB800] border-2 border-black shadow-[2px_2px_0px_#000] cursor-default"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-black inline-block" />
            <span className="font-semibold text-[13px] tracking-wide text-black">
              About Me
            </span>
          </motion.span>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          {/* Left Column: Profile Card */}
          <motion.div
            className="lg:col-span-5 w-full"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.15 }}
          >
            <motion.div
              whileHover={{ y: -4, rotate: -0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-full rounded-[24px] bg-[#FFECC7] border-[2.5px] border-black p-5 sm:p-6 shadow-[5px_5px_0px_#000] flex flex-col"
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block animate-pulse" />
                  <span className="font-medium text-[11px] sm:text-[12px] text-black">
                    Active Developer
                  </span>
                </span>
                <span className="font-medium text-[11px] sm:text-[12px] text-black">
                  Depok, ID (UTC+7)
                </span>
              </div>

              {/* Profile Photo */}
              <div className="relative w-full aspect-[4/3] rounded-[18px] border-2 border-black overflow-hidden my-5 shadow-[2px_2px_0px_#000] bg-gray-100">
                <Image
                  src="/assets/dlyy.png"
                  alt="Padly Padilah"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-wrap gap-2">
                  {["Go", "TypeScript", "React & Next.js"].map((pill) => (
                    <motion.span
                      key={pill}
                      whileHover={{ scale: 1.06, y: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="px-3.5 py-1 bg-white border-2 border-black rounded-[8px] font-medium text-[12px] text-black shadow-[2px_2px_0px_#000] cursor-default"
                    >
                      {pill}
                    </motion.span>
                  ))}
                </div>
                <div>
                  <motion.span
                    whileHover={{ scale: 1.04, y: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="inline-block px-3.5 py-1 bg-white border-2 border-black rounded-[8px] font-medium text-[12px] text-black shadow-[2px_2px_0px_#000] cursor-default"
                  >
                    Web &amp; Mobile Developer
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Bio & Links */}
          <motion.div
            className="lg:col-span-7 flex flex-col justify-between h-full pt-1"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.2 }}
          >
            <div>
              <h2 className="text-[28px] sm:text-[34px] md:text-[37px] font-semibold text-[#141414] leading-[1.22] tracking-tight mb-5">
                Bridging aesthetic rigor &amp; resilient backend systems.
              </h2>

              <p className="text-[14px] sm:text-[15.5px] font-normal text-[#4B5563] leading-[1.7] mb-4">
                I&apos;m a Full Stack Web Developer with focus on backend
                building solid APIs, clean database structures, and systems that
                stay maintainable as they grow.
              </p>

              <p className="text-[14px] sm:text-[15.5px] font-normal text-[#4B5563] leading-[1.7]">
                For styling, I usually build on templates I&apos;ve put together
                from previous projects, adapting them with an eye for clean,
                intentional visual details.
              </p>
            </div>

            {/* Separator Line */}
            <div className="w-full border-t border-black/20 my-7" />

            {/* Social Media Buttons with tactile bouncy hover */}
            <div>
              <div className="flex flex-wrap items-center gap-3.5">
                <motion.a
                  whileHover={{ y: -4, scale: 1.04 }}
                  whileTap={{ scale: 0.95, x: 2, y: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  href="https://discord.com/users/902753975521132635"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4.5 py-2.5 rounded-[14px] bg-[#C084FC] border-2 border-black shadow-[3px_3px_0px_#000] font-medium text-[13px] text-black flex items-center gap-2 cursor-pointer"
                >
                  <span>Discord</span>
                  <DiscordIcon size={18} className="text-black" />
                </motion.a>

                <motion.a
                  whileHover={{ y: -4, scale: 1.04 }}
                  whileTap={{ scale: 0.95, x: 2, y: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  href="https://github.com/Daislyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4.5 py-2.5 rounded-[14px] bg-[#FFB800] border-2 border-black shadow-[3px_3px_0px_#000] font-medium text-[13px] text-black flex items-center gap-2 cursor-pointer"
                >
                  <span>Github</span>
                  <GithubIcon size={18} className="text-black" />
                </motion.a>

                <motion.a
                  whileHover={{ y: -4, scale: 1.04 }}
                  whileTap={{ scale: 0.95, x: 2, y: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  href="https://www.instagram.com/dlyy.23_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4.5 py-2.5 rounded-[14px] bg-[#FF6B6B] border-2 border-black shadow-[3px_3px_0px_#000] font-medium text-[13px] text-black flex items-center gap-2 cursor-pointer"
                >
                  <span>Instagram</span>
                  <InstagramIcon size={18} className="text-black" />
                </motion.a>

                <motion.a
                  whileHover={{ y: -4, scale: 1.04 }}
                  whileTap={{ scale: 0.95, x: 2, y: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  href="https://www.facebook.com/azuto.mizanami/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4.5 py-2.5 rounded-[14px] bg-[#2DD4BF] border-2 border-black shadow-[3px_3px_0px_#000] font-medium text-[13px] text-black flex items-center gap-2 cursor-pointer"
                >
                  <span>Facebook</span>
                  <FacebookIcon size={18} className="text-black" />
                </motion.a>

                <motion.a
                  whileHover={{ y: -4, scale: 1.04 }}
                  whileTap={{ scale: 0.95, x: 2, y: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  href="https://www.youtube.com/@Dlyy840"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4.5 py-2.5 rounded-[14px] bg-[#EF4444] border-2 border-black shadow-[3px_3px_0px_#000] font-medium text-[13px] text-black flex items-center gap-2 cursor-pointer"
                >
                  <span>Youtube</span>
                  <YoutubeIcon size={18} className="text-black" />
                </motion.a>
              </div>

              {/* Direct Contact & Collaboration Box */}
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mt-7 border-2 border-black rounded-[18px] p-3.5 sm:p-4 bg-white shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-11 h-11 rounded-[12px] bg-[#FF5C00] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    <Send
                      size={18}
                      strokeWidth={2.5}
                      className="text-white -rotate-12 translate-x-0.5"
                    />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[13px] sm:text-[14px] text-black leading-tight">
                      Direct Contact &amp; Collaboration
                    </span>
                    <span className="font-normal text-[11px] sm:text-[12px] text-[#6B7280] leading-tight mt-1">
                      Drop an email or subscribe for project updates
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <span className="border-2 border-black bg-white rounded-[10px] px-3.5 py-1.5 text-[12px] font-medium text-black select-all">
                    {email}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94, x: 1, y: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={handleCopy}
                    className="bg-[#FFB800] hover:bg-[#FFA500] border-2 border-black rounded-[10px] px-4 py-1.5 text-[12px] font-medium text-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={14} strokeWidth={2.5} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} strokeWidth={2.5} />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
