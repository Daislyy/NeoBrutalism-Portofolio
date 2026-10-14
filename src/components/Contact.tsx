"use client";

import { useState, useEffect } from "react";
import { Mail, Copy, Check, X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "New Project Inquiry",
    message: "",
  });

  const emailAddress = "padly.dev@gmail.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending & mailto fallback
    setIsSubmitted(true);
    setTimeout(() => {
      window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(
        formData.subject + " - from " + formData.name
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
    }, 800);
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsSubmitted(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <section
      id="contact"
      className="w-full pt-14 sm:pt-20 pb-36 sm:pb-48"
    >
      <div className="w-full max-w-[1104px] mx-auto px-4 sm:px-6">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-[920px] mx-auto"
        >
          {/* Yellow Offset Neo-brutalist Shadow Layer */}
          <div
            className="absolute inset-0 rounded-[28px] sm:rounded-[36px] translate-x-[8px] translate-y-[8px] sm:translate-x-[12px] sm:translate-y-[12px]"
            style={{
              backgroundColor: "#FFB800",
              border: "2.5px solid #000000",
            }}
          />

          {/* Foreground Card */}
          <div
            className="relative bg-white border-[2.5px] border-black rounded-[28px] sm:rounded-[36px] py-10 sm:py-14 px-6 sm:px-12 flex flex-col items-center justify-center text-center"
          >
            {/* Title - clean bold sans-serif matching Figma */}
            <h2
              className="text-3xl sm:text-4xl md:text-[46px] font-black text-black tracking-tight leading-[1.15] mb-7 sm:mb-9 max-w-xl"
              style={{ fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif" }}
            >
              Have an Idea or Project
              <br />
              in
              <br />
              Mind?
            </h2>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              {/* Start a Conversation Button */}
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96, x: 2, y: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => setIsModalOpen(true)}
                className="h-[46px] sm:h-[48px] px-6 sm:px-7 rounded-full bg-[#FF5C00] hover:bg-[#FF4D00] text-white font-bold text-sm sm:text-[15px] flex items-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer select-none"
              >
                <span>Start a Conversation</span>
                <Mail size={16} strokeWidth={2.5} />
              </motion.button>

              {/* Email Copy Button */}
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96, x: 2, y: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={handleCopy}
                title="Click to copy email address"
                className="h-[46px] sm:h-[48px] px-5 sm:px-6 rounded-full bg-white hover:bg-neutral-50 text-black font-bold text-xs sm:text-[14px] flex items-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer select-none"
              >
                {copied ? (
                  <>
                    <Check size={15} strokeWidth={3} className="text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={15} strokeWidth={2.5} className="text-neutral-700" />
                    <span className="font-mono text-xs sm:text-[13px]">{emailAddress}</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── CONVERSATION MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[99998] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-[540px] bg-white border-[3px] border-black rounded-[24px] sm:rounded-[28px] shadow-[10px_10px_0px_#000000] overflow-hidden z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-[#FFECC7]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#FF5C00] border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
                    <Mail size={14} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-[16px] text-black tracking-tight">
                    Start a Conversation
                  </span>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-[#FF0000] hover:text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-10 text-center flex flex-col items-center gap-3"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#22C55E] border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
                      <Sparkles size={28} className="text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-black mt-2">
                      Opening Your Email App!
                    </h3>
                    <p className="text-sm text-neutral-600 max-w-xs">
                      Redirecting with your pre-filled inquiry to {emailAddress}...
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <p className="text-[13.5px] text-neutral-600 font-normal leading-relaxed -mt-1 mb-1">
                      Have a project idea, question, or just want to connect? Drop a message below!
                    </p>

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold font-mono tracking-wider text-black uppercase">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g. Alex Johnson"
                        className="w-full h-11 px-3.5 rounded-[10px] bg-white border-2 border-black font-medium text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:bg-[#FFF9EE] shadow-[2px_2px_0px_#000]"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold font-mono tracking-wider text-black uppercase">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="alex@example.com"
                        className="w-full h-11 px-3.5 rounded-[10px] bg-white border-2 border-black font-medium text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:bg-[#FFF9EE] shadow-[2px_2px_0px_#000]"
                      />
                    </div>

                    {/* Subject / Topic */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold font-mono tracking-wider text-black uppercase">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        placeholder="New Project Inquiry"
                        className="w-full h-11 px-3.5 rounded-[10px] bg-white border-2 border-black font-medium text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:bg-[#FFF9EE] shadow-[2px_2px_0px_#000]"
                      />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold font-mono tracking-wider text-black uppercase">
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Tell me about your project, timeline, or idea..."
                        className="w-full p-3.5 rounded-[10px] bg-white border-2 border-black font-medium text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:bg-[#FFF9EE] shadow-[2px_2px_0px_#000] resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="mt-2 w-full h-12 rounded-[12px] bg-[#FF5C00] hover:bg-[#FF4D00] text-white font-extrabold text-[15px] flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                    >
                      <span>Send Message</span>
                      <Send size={16} strokeWidth={2.5} />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
