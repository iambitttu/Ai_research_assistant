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
    <header className="w-full h-14 border-b border-border-custom bg-bg-app flex items-center justify-between px-4 shrink-0 transition-colors duration-200">
      {/* Left Sidebar Toggle */}
      <div className="flex items-center space-x-2">
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2 hover:bg-bg-card text-txt-secondary hover:text-txt-primary rounded-lg transition-colors duration-150"
            title="Open sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}
      </div>

      {/* Center Model Selector (Dropdown) */}
      <div className="flex items-center justify-center">
        <div className="relative flex items-center">
          <select
            value={settings.model}
            onChange={(e) => setSettings({ model: e.target.value })}
            className="appearance-none bg-transparent hover:bg-bg-card text-txt-secondary hover:text-txt-primary pl-7.5 pr-8 py-1.5 rounded-xl text-xs font-bold font-sans tracking-tight border-0 outline-none focus:ring-0 focus:border-0 cursor-pointer transition-colors duration-150 text-center"
          >
            <option value="gemini-3.5-flash">Aethera 3.5 Flash</option>
            <option value="gemini-2.5-pro">Aethera 2.5 Pro</option>
            <option value="gemini-2.5-flash">Aethera 2.5 Flash</option>
            <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
          <div className="absolute left-2.5 pointer-events-none text-accent-custom">
            <Sparkles size={11} />
          </div>
          <div className="absolute right-2.5 pointer-events-none text-txt-secondary text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* Right Theme Toggle */}
      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-bg-card text-txt-secondary hover:text-txt-primary rounded-lg transition-colors duration-150"
          title="Toggle Theme"
        >
          {settings.theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
