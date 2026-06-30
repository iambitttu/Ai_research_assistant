"use client";

import React from "react";
import { useChatStore } from "@/store/chatStore";
import {
  Compass,
  Code,
  Sparkles,
  BookOpen,
  Scale,
  Brain,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface HomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

const SUGGESTIONS = [
  {
    icon: Scale,
    title: "Compare Claude vs Gemini",
    desc: "Detailed side-by-side model comparison of speed, token limits and code execution.",
    prompt: "Compare Claude vs Gemini",
    color: "text-accent-blue bg-accent-blue/10",
  },
  {
    icon: Sparkles,
    title: "Latest AI News",
    desc: "Scrape the web for the latest artificial intelligence breakthroughs and releases.",
    prompt: "Latest AI News",
    color: "text-accent-purple bg-accent-purple/10",
  },
  {
    icon: BookOpen,
    title: "Explain Quantum Computing",
    desc: "Understand superposition, qubits, Shor's algorithm, and quantum physics equations.",
    prompt: "Explain Quantum Computing",
    color: "text-accent-indigo bg-accent-indigo/10",
  },
  {
    icon: Code,
    title: "Build React Dashboard",
    desc: "Generate clean TypeScript dashboard components styled using Tailwind CSS classes.",
    prompt: "Build React Dashboard",
    color: "text-emerald-500 bg-emerald-500/10",
  },
];

export default function HomeScreen({ onSelectPrompt }: HomeScreenProps) {
  const { searchMode } = useChatStore();

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl w-full mx-auto flex flex-col items-center justify-center py-12 px-4 flex-1"
    >
      {/* Premium Logo Header */}
      <motion.div variants={itemVariants} className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-accent-indigo to-accent-purple shadow-xl mb-4">
          <Sparkles className="text-white w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-txt-primary">
          Aethera Research Engine
        </h1>
        <p className="text-sm text-txt-secondary mt-2 max-w-md mx-auto">
          State-of-the-art search synthesis, rich coding environments, and mathematical modeling.
        </p>
      </motion.div>

      {/* Suggested Prompts Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6"
      >
        {SUGGESTIONS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              onClick={() => onSelectPrompt(s.prompt)}
              className="p-5 bg-bg-card border border-border-custom rounded-2xl cursor-pointer hover:border-accent-indigo/40 hover:shadow-lg transition duration-200 flex flex-col justify-between h-[130px] group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl ${s.color}`}>
                  <Icon size={18} />
                </div>
                <ChevronRight
                  size={16}
                  className="text-txt-muted group-hover:text-accent-indigo group-hover:translate-x-1 transition duration-200"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-txt-primary group-hover:text-accent-indigo transition">
                  {s.title}
                </h3>
                <p className="text-[10px] text-txt-secondary mt-1 line-clamp-2">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
