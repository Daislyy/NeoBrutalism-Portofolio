"use client";

import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiExpo,
  SiNodedotjs,
  SiExpress,
  SiSupabase,
  SiMysql,
  SiGo,
  SiPython,
  SiPostman,
  SiDocker,
  SiGit,
} from "react-icons/si";
import { Layers } from "lucide-react";
import { motion } from "framer-motion";

interface TechItem {
  name: string;
  level: string;
  icon: React.ReactNode;
  iconBg: string;
}

interface TechCategory {
  title: string;
  description: string;
  items: TechItem[];
}

const techCategories: TechCategory[] = [
  {
    title: "Frontend Architecture",
    description: "Component-driven interfaces with tactile reactive physics.",
    items: [
      {
        name: "Next.js",
        level: "Advanced",
        icon: <SiNextdotjs size={18} className="text-white" />,
        iconBg: "bg-[#000000]",
      },
      {
        name: "React.js",
        level: "Advanced",
        icon: <SiReact size={18} className="text-[#0ea5e9]" />,
        iconBg: "bg-[#e0f2fe]",
      },
      {
        name: "TypeScript",
        level: "Intermediate",
        icon: <SiTypescript size={16} className="text-white" />,
        iconBg: "bg-[#2563eb]",
      },
      {
        name: "JavaScript",
        level: "Advanced",
        icon: <SiJavascript size={16} className="text-[#000000]" />,
        iconBg: "bg-[#facc15]",
      },
      {
        name: "Tailwind CSS",
        level: "Advanced",
        icon: <SiTailwindcss size={18} className="text-[#06b6d4]" />,
        iconBg: "bg-[#ecfeff]",
      },
    ],
  },
  {
    title: "Mobile Systems",
    description:
      "Cross-platform mobile applications with fluid gestures and offline sync.",
    items: [
      {
        name: "React.js",
        level: "Intermediate",
        icon: <SiReact size={18} className="text-[#0ea5e9]" />,
        iconBg: "bg-[#e0f2fe]",
      },
      {
        name: "Expo",
        level: "Intermediate",
        icon: <SiExpo size={17} className="text-[#000000]" />,
        iconBg: "bg-[#f4f4f5]",
      },
    ],
  },
  {
    title: "Backend & Cloud",
    description:
      "Scalable API architectures, database models, and cloud services.",
    items: [
      {
        name: "Node.js",
        level: "Intermediate",
        icon: <SiNodedotjs size={18} className="text-[#16a34a]" />,
        iconBg: "bg-[#dcfce7]",
      },
      {
        name: "Express.js",
        level: "Intermediate",
        icon: <SiExpress size={18} className="text-[#141414]" />,
        iconBg: "bg-[#f4f4f5]",
      },
      {
        name: "Supabase",
        level: "Intermediate",
        icon: <SiSupabase size={17} className="text-[#10b981]" />,
        iconBg: "bg-[#dcfce7]",
      },
      {
        name: "MySQL",
        level: "Intermediate",
        icon: <SiMysql size={20} className="text-[#0284c7]" />,
        iconBg: "bg-[#e0f2fe]",
      },
      {
        name: "Go",
        level: "Basic",
        icon: <SiGo size={22} className="text-[#00acd7]" />,
        iconBg: "bg-[#e0f2fe]",
      },
      {
        name: "Python",
        level: "Basic",
        icon: <SiPython size={18} className="text-[#ca8a04]" />,
        iconBg: "bg-[#fef9c3]",
      },
    ],
  },
  {
    title: "Tooling & Quality",
    description:
      "Rigorous API orchestration, telemetry, and developer toolchains.",
    items: [
      {
        name: "Postman",
        level: "Advanced",
        icon: <SiPostman size={18} className="text-[#ea580c]" />,
        iconBg: "bg-[#ffedd5]",
      },
      {
        name: "Docker",
        level: "Intermediate",
        icon: <SiDocker size={18} className="text-[#2563eb]" />,
        iconBg: "bg-[#dbeafe]",
      },
      {
        name: "Git & GitHub",
        level: "Advanced",
        icon: <SiGit size={18} className="text-[#ef4444]" />,
        iconBg: "bg-[#fee2e2]",
      },
    ],
  },
];

export default function TechStack() {
  return (
    <section
      id="tech-stack"
      className="w-full border-t-2 border-b-2 border-black py-16 sm:py-20 my-8 overflow-hidden"
      style={{ fontFamily: "var(--font-fredoka), cursive, sans-serif" }}
    >
      <div className="w-full max-w-[1104px] mx-auto px-6">
        {/* Eyebrow Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-3"
        >
          <Layers size={14} className="text-[#059669]" strokeWidth={2.5} />
          <span className="font-bold text-[12px] tracking-[0.2em] text-[#059669] uppercase">
            Technical Stack
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.1 }}
          className="text-[38px] sm:text-[46px] md:text-[50px] font-bold text-[#141414] leading-[1.08] tracking-tight mb-10"
        >
          Curated
          <br />
          Technologies
        </motion.h2>

        {/* 2x2 Grid of Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {techCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 22,
                delay: catIndex * 0.1,
              }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-[26px] border border-gray-200/90 p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-lg transition-shadow"
            >
              <h3 className="text-[19px] sm:text-[20px] font-bold text-[#141414] tracking-tight">
                {category.title}
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#6B7280] font-normal mt-1.5 mb-6 leading-relaxed">
                {category.description}
              </p>

              {/* Badges / Tech Pills */}
              <div className="flex flex-wrap gap-3">
                {category.items.map((item) => (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] border border-gray-200 bg-white hover:border-black/40 hover:shadow-sm transition-colors cursor-default"
                  >
                    <div
                      className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${item.iconBg}`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex flex-col pr-1">
                      <span className="text-[13px] font-bold text-[#141414] leading-tight">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-normal text-[#6B7280] leading-tight mt-0.5">
                        {item.level}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
