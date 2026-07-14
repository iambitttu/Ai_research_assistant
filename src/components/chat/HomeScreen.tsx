"use client";

import React from "react";
import { useChatStore } from "@/store/chatStore";
import {
  Sparkles,
  Map,
  Mail,
  Code,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface HomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

const SUGGESTIONS = [
  {
    icon: Map,
    title: "Plan a trip",
    desc: "Help me plan a 5-day itinerary for a trip to Tokyo.",
    prompt: "Can you help me plan a 5-day itinerary for a trip to Tokyo? I like historic temples, local street food, and modern gadgets.",
  },
  {
    icon: Mail,
    title: "Help me write",
    desc: "Write a polite email asking for prototype feedback.",
    prompt: "Write a short, polite email to a client requesting feedback on the project prototype we delivered yesterday.",
  },
  {
    icon: Code,
    title: "Explain code",
    desc: "Understand recursion in JavaScript with simple analogies.",
    prompt: "Explain how recursion works in JavaScript using a simple, real-world analogy and a short code example.",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm ideas",
    desc: "Suggest 10 creative names for a new AI tools startup.",
    prompt: "Brainstorm 10 creative, modern, and memorable names for a new startup focused on AI productivity tools.",
  },
];

export default function HomeScreen({ onSelectPrompt }: HomeScreenProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-xl w-full mx-auto flex flex-col items-center justify-center py-10 px-4 flex-1 text-center"
    >
      {/* Brand Header */}
      <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
        <div className="relative mb-5 select-none">
          {/* Pulsing glow halo */}
          <div className="absolute inset-0 rounded-full bg-accent-custom/25 blur-md animate-pulse scale-110" />
          <div className="relative w-11 h-11 rounded-full bg-accent-custom flex items-center justify-center text-white shadow-lg border border-accent-custom/10 transition-transform duration-300 hover:scale-105">
            <Sparkles size={18} />
          </div>
        </div>
        
        <h1 className="text-2xl font-extrabold tracking-tight text-txt-primary select-none">
          How can I help you today?
        </h1>
      </motion.div>

      {/* Suggested Prompts Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4"
      >
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              onClick={() => onSelectPrompt(item.prompt)}
              className="p-4 text-left border border-border-custom/30 bg-bg-card/25 hover:bg-bg-card hover:border-accent-custom/25 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 flex items-start space-x-3.5 group shadow-2xs hover:shadow-xs"
            >
              <div className="p-2 bg-bg-app border border-border-custom/40 rounded-xl text-txt-secondary group-hover:text-accent-custom group-hover:bg-accent-light transition duration-200 shrink-0">
                <Icon size={15} />
              </div>
              <div className="truncate flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-txt-primary group-hover:text-accent-custom transition duration-150">
                    {item.title}
                  </h4>
                  <ArrowUpRight
                    size={13}
                    className="text-txt-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-200"
                  />
                </div>
                <p className="text-[10.5px] text-txt-secondary mt-1 truncate">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
