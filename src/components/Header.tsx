"use client";

import React from "react";
import { useChatStore } from "@/store/chatStore";
import { PanelLeftOpen, Sun, Moon, Sparkles } from "lucide-react";

interface HeaderProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean) => void;
}

export default function Header({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: HeaderProps) {
  const { settings, setSettings } = useChatStore();

  const toggleTheme = () => {
    setSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
  };

  return (
    <header className="w-full h-14 border-b border-border-custom/50 bg-bg-app/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 transition-colors duration-200 z-10">
      {/* Left Sidebar Toggle */}
      <div className="flex items-center space-x-2">
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2 hover:bg-bg-card text-txt-secondary hover:text-accent-indigo rounded-xl hover:scale-105 transition-all duration-200 cursor-pointer"
            title="Open sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}
      </div>

      {/* Center Model Selector (Dropdown) */}
      <div className="flex items-center justify-center">
        <div className="relative flex items-center bg-bg-card/50 border border-border-custom/60 rounded-xl hover:bg-bg-card hover:border-border-custom hover:shadow-2xs transition-all duration-200 pl-7 pr-8 py-1 cursor-pointer">
          <select
            value={settings.model}
            onChange={(e) => setSettings({ model: e.target.value })}
            className="appearance-none bg-transparent text-txt-secondary hover:text-txt-primary py-0.5 rounded-xl text-xs font-bold font-sans tracking-tight border-0 outline-none focus:ring-0 focus:border-0 cursor-pointer text-center"
          >
            <option value="gemini-3.5-flash" className="bg-bg-app text-txt-primary">Aethera 3.5 Flash</option>
            <option value="gemini-2.5-pro" className="bg-bg-app text-txt-primary">Aethera 2.5 Pro</option>
            <option value="gemini-2.5-flash" className="bg-bg-app text-txt-primary">Aethera 2.5 Flash</option>
            <option value="claude-3.5-sonnet" className="bg-bg-app text-txt-primary">Claude 3.5 Sonnet</option>
            <option value="gpt-4o" className="bg-bg-app text-txt-primary">GPT-4o</option>
          </select>
          <div className="absolute left-2.5 pointer-events-none text-accent-indigo">
            <Sparkles size={11} />
          </div>
          <div className="absolute right-2.5 pointer-events-none text-txt-secondary text-[8px]">
            ▼
          </div>
        </div>
      </div>

      {/* Right Theme Toggle */}
      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-bg-card text-txt-secondary hover:text-accent-indigo rounded-xl hover:scale-105 transition-all duration-200 cursor-pointer"
          title="Toggle Theme"
        >
          {settings.theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
