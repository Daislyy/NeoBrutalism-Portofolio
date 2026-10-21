"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface TrajectoryItem {
  id: string;
  period: string;
  isCurrent?: boolean;
  role: string;
  institution: string;
  location: string;
  description: string;
  dotColor: string;
  skills: {
    name: string;
    variant?: "green-outline" | "green-solid" | "black-outline";
  }[];
}

const trajectoryData: TrajectoryItem[] = [
  {
    id: "01",
    period: "2024 - NOW",
    isCurrent: true,
    role: "Software Engineering Student",
    institution: "SMK Taruna Bhakti Depok",
    location: "Depok, Indonesia",
    description:
      "Focusing on modern full-stack development, reactive web architectures, mobile development with React Native, and robust backend database systems.",
    dotColor: "#10B981", // vibrant emerald green
    skills: [
      { name: "Full Stack Dev", variant: "green-outline" },
      { name: "Next.js & React", variant: "green-outline" },
      { name: "React Native", variant: "green-outline" },
      { name: "Node.js & Express", variant: "green-outline" },
      { name: "MySQL & Supabase", variant: "green-outline" },
      { name: "Focus on Backend Engineer", variant: "green-solid" },
    ],
  },
  {
    id: "02",
    period: "2021 - 2024",
    isCurrent: false,
    role: "Junior High School Student",
    institution: "SMP PGRI Depok II Tengah",
    location: "Depok, Indonesia",
    description:
      "Foundational academic studies, early exploration into programming logic, web technologies, and computational problem solving.",
    dotColor: "#64748B", // slate grey
    skills: [
      { name: "Informatics Basics", variant: "black-outline" },
      { name: "Microsoft Excel", variant: "black-outline" },
    ],
  },
];

export default function Trajectory() {
  const { isDark } = useTheme();

  return (
    <section
      id="journey"
      className="w-full py-16 sm:py-24"
      style={{ fontFamily: "var(--font-fredoka), cursive, sans-serif" }}
    >
      <div className="w-full max-w-[1104px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-20"
        >
          <span className="font-mono font-bold text-[12px] sm:text-[13px] tracking-[0.2em] text-[#059669] dark:text-[#34D399] uppercase mb-2 inline-block transition-colors">
            EDUCATION &amp; JOURNEY
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 transition-colors ${
            isDark ? "text-white" : "text-black"
          }`}>
            The Trajectory
          </h2>
          <p className={`text-sm sm:text-base font-normal leading-relaxed transition-colors ${
            isDark ? "text-slate-300" : "text-neutral-600"
          }`}>
            Academic foundation, software engineering studies, and continuous technical craft.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10">
          {/* Vertical Timeline Axis Line */}
          <div
            className={`absolute left-[11px] sm:left-[19px] top-4 bottom-8 w-[2.5px] transition-colors ${
              isDark ? "bg-[#4B5563]" : "bg-black"
            }`}
            aria-hidden="true"
          />

          <div className="flex flex-col gap-10 sm:gap-14">
            {trajectoryData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Timeline Circle Node */}
                <div
                  className="absolute -left-[24px] sm:-left-[32px] top-6 w-[18px] h-[18px] rounded-full border-[2.5px] border-black z-10"
                  style={{ backgroundColor: item.dotColor }}
                />

                {/* Neo-brutalist Card */}
                <div className={`border-[2.5px] border-black rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] hover:-translate-y-1 transition-all duration-200 ${
                  isDark ? "bg-[#282D37] text-white" : "bg-white text-black"
                }`}>
                  {/* Top Bar: Period Pill & Location */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    {/* Period Badge */}
                    <span
                      className={`inline-block font-mono font-bold text-xs sm:text-[13px] tracking-wider px-3 py-1 rounded-[8px] border-2 border-black ${
                        item.isCurrent
                          ? (isDark ? "bg-[#A855F7] text-white" : "bg-[#FFB800] text-black")
                          : (isDark ? "bg-[#323846] text-white" : "bg-white text-black")
                      }`}
                    >
                      {item.period}
                    </span>

                    {/* Location */}
                    <span className={`font-mono text-xs sm:text-[13px] font-medium transition-colors ${
                      isDark ? "text-slate-300" : "text-neutral-500"
                    }`}>
                      {item.location}
                    </span>
                  </div>

                  {/* Title & Institution */}
                  <h3 className={`text-xl sm:text-2xl font-bold tracking-tight mb-1 transition-colors ${
                    isDark ? "text-white" : "text-black"
                  }`}>
                    {item.role}
                  </h3>
                  <p className={`text-xs sm:text-sm font-bold tracking-wide mb-3 transition-colors ${isDark ? "text-[#C084FC]" : "text-[#FF5C00]"}`}>
                    {item.institution}
                  </p>

                  {/* Description */}
                  <p className={`text-[13px] sm:text-sm font-normal leading-relaxed mb-5 transition-colors ${
                    isDark ? "text-slate-300" : "text-neutral-600"
                  }`}>
                    {item.description}
                  </p>

                  {/* Skills / Badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.skills.map((skill) => {
                      if (skill.variant === "green-solid") {
                        return (
                          <span
                            key={skill.name}
                            className="px-3 py-1 text-xs font-mono font-bold text-white bg-[#059669] dark:bg-[#047857] border-2 border-black rounded-[6px]"
                          >
                            {skill.name}
                          </span>
                        );
                      }
                      if (skill.variant === "green-outline") {
                        return (
                          <span
                            key={skill.name}
                            className="px-3 py-1 text-xs font-mono font-bold text-[#059669] dark:text-[#34D399] bg-[#ecfdf5] dark:bg-[#06231a] border-2 border-[#059669] dark:border-[#047857] rounded-[6px] transition-colors"
                          >
                            {skill.name}
                          </span>
                        );
                      }
                      // black-outline default
                      return (
                        <span
                          key={skill.name}
                          className="px-3 py-1 text-xs font-mono font-bold text-black dark:text-[#E5E7EB] bg-white dark:bg-[#22252F] border-2 border-black rounded-[6px] transition-colors"
                        >
                          {skill.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
