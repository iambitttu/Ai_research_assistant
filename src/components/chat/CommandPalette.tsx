"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { SearchMode } from "@/types/chat";
import {
  Search,
  MessageSquare,
  Sparkles,
  Command,
  Plus,
  Sliders,
  Trash2,
  Moon,
  Sun,
  Layout,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenSettings,
  onToggleSidebar,
}: CommandPaletteProps) {
  const {
    conversations,
    setActiveId,
    createNewConversation,
    setSearchMode,
    settings,
    setTheme,
    clearAllData,
  } = useChatStore();

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectChat = (id: string) => {
    setActiveId(id);
    onClose();
  };

  const handleCreateNewChat = () => {
    createNewConversation();
    onClose();
  };

  const handleSelectMode = (mode: SearchMode) => {
    setSearchMode(mode);
    onClose();
  };

  const handleToggleTheme = () => {
    setTheme(settings.theme === "dark" ? "light" : "dark");
    onClose();
  };

  const handlePurge = () => {
    if (confirm("Purge all conversations? This cannot be undone.")) {
      clearAllData();
      onClose();
    }
  };

  const filteredChats = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const commandItems = [
    { label: "New Search Thread", icon: Plus, action: handleCreateNewChat, category: "Actions" },
    { label: "Toggle Sidebar Layout", icon: Layout, action: () => { onToggleSidebar(); onClose(); }, category: "Actions" },
    { label: "Toggle Color Theme", icon: settings.theme === "dark" ? Sun : Moon, action: handleToggleTheme, category: "Actions" },
    { label: "Open Workspace Settings", icon: Sliders, action: () => { onOpenSettings(); onClose(); }, category: "Actions" },
    { label: "Purge Conversations", icon: Trash2, action: handlePurge, category: "Danger Zone", danger: true },
  ];

  const searchModes = [
    { label: "General Mode", mode: "general", desc: "Search the web" },
    { label: "Academic Research", mode: "research", desc: "Scientific literature search" },
    { label: "Software Engineering", mode: "coding", desc: "Write or explain code" },
    { label: "Reasoning (Thinking)", mode: "reasoning", desc: "Step-by-step logic path" },
  ];

  const filteredModes = searchModes.filter(
    (m) =>
      m.label.toLowerCase().includes(query.toLowerCase()) ||
      m.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="w-full max-w-xl bg-bg-card border border-border-custom shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[400px] relative z-10 select-none"
      >
        {/* Search Input */}
        <div className="flex items-center space-x-3 px-4 py-3.5 border-b border-border-custom bg-bg-app">
          <Search size={16} className="text-txt-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search conversations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-txt-primary placeholder:text-txt-muted text-xs focus:ring-0"
          />
          <kbd className="bg-bg-card px-1.5 py-0.5 rounded border border-border-custom text-[8px] font-mono text-txt-muted shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results Pane */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3.5 scrollbar-thin">
          {/* Active Conversations Section */}
          {filteredChats.length > 0 && (
            <div>
              <p className="px-2.5 text-[9px] font-extrabold text-txt-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MessageSquare size={10} /> Active Threads ({filteredChats.length})
              </p>
              <div className="space-y-0.5">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className="w-full flex items-center space-x-2.5 py-2 px-3 hover:bg-accent-indigo-light hover:text-accent-indigo rounded-xl text-left text-xs text-txt-secondary transition duration-150"
                  >
                    <MessageSquare size={12} className="shrink-0 text-txt-muted" />
                    <span className="truncate flex-1 font-medium">{chat.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Modes Category */}
          {filteredModes.length > 0 && (
            <div>
              <p className="px-2.5 text-[9px] font-extrabold text-txt-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles size={10} /> Search Modes
              </p>
              <div className="space-y-0.5">
                {filteredModes.map((modeItem) => (
                  <button
                    key={modeItem.mode}
                    onClick={() => handleSelectMode(modeItem.mode as SearchMode)}
                    className="w-full flex items-center justify-between py-2 px-3 hover:bg-accent-indigo-light hover:text-accent-indigo rounded-xl text-left text-xs text-txt-secondary transition duration-150"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Sparkles size={12} className="shrink-0 text-txt-muted" />
                      <span className="font-bold">{modeItem.label}</span>
                    </div>
                    <span className="text-[10px] text-txt-muted font-medium">{modeItem.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Settings / General Commands category */}
          <div>
            <p className="px-2.5 text-[9px] font-extrabold text-txt-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Command size={10} /> System Commands
            </p>
            <div className="space-y-0.5">
              {commandItems
                .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
                .map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={item.action}
                      className={`w-full flex items-center space-x-2.5 py-2 px-3 rounded-xl text-left text-xs transition duration-150 ${
                        item.danger
                          ? "hover:bg-rose-500/10 text-rose-500 font-bold"
                          : "hover:bg-accent-indigo-light hover:text-accent-indigo text-txt-secondary font-medium"
                      }`}
                    >
                      <Icon size={12} className="shrink-0" />
                      <span className="flex-1">{item.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {filteredChats.length === 0 && filteredModes.length === 0 && query.trim() !== "" && (
            <div className="py-8 text-center text-xs text-txt-muted font-medium">
              No matching commands or active threads found.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
