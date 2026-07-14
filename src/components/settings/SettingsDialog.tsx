"use client";

import React, { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import {
  X,
  Sliders,
  Sparkles,
  Command,
  ShieldAlert,
  Moon,
  Sun,
  Trash2,
  Download,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { settings, setSettings, clearAllData, conversations } = useChatStore();
  const [activeTab, setActiveTab] = useState<"general" | "model" | "shortcuts" | "privacy">("general");
  const [showClearSuccess, setShowClearSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExportData = () => {
    const dataStr = JSON.stringify({ conversations, settings }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aethera-workspace-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to delete all messages? This action is permanent.")) {
      clearAllData();
      setShowClearSuccess(true);
      setTimeout(() => {
        setShowClearSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Dialog Body */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-bg-card border border-border-custom shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row h-[480px] relative z-10"
      >
        {/* Sidebar Nav */}
        <div className="w-full md:w-[180px] bg-bg-app border-r border-border-custom p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold text-txt-muted uppercase tracking-wider px-2 mb-3">Settings</h2>
            
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full flex items-center space-x-2 py-2 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "general"
                  ? "bg-accent-light text-accent-custom"
                  : "text-txt-secondary hover:bg-bg-card hover:text-txt-primary"
              }`}
            >
              <Sliders size={13} />
              <span>General</span>
            </button>

            <button
              onClick={() => setActiveTab("model")}
              className={`w-full flex items-center space-x-2 py-2 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "model"
                  ? "bg-accent-light text-accent-custom"
                  : "text-txt-secondary hover:bg-bg-card hover:text-txt-primary"
              }`}
            >
              <Sparkles size={13} />
              <span>AI Engine</span>
            </button>

            <button
              onClick={() => setActiveTab("shortcuts")}
              className={`w-full flex items-center space-x-2 py-2 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "shortcuts"
                  ? "bg-accent-light text-accent-custom"
                  : "text-txt-secondary hover:bg-bg-card hover:text-txt-primary"
              }`}
            >
              <Command size={13} />
              <span>Shortcuts</span>
            </button>

            <button
              onClick={() => setActiveTab("privacy")}
              className={`w-full flex items-center space-x-2 py-2 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "privacy"
                  ? "bg-accent-light text-accent-custom"
                  : "text-txt-secondary hover:bg-bg-card hover:text-txt-primary"
              }`}
            >
              <ShieldAlert size={13} />
              <span>Privacy</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="hidden md:flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-bg-card border border-border-custom hover:border-accent-custom/30 rounded-xl text-[10px] text-txt-secondary hover:text-txt-primary transition cursor-pointer"
          >
            <span>Close Settings</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between select-text scrollbar-thin">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-bg-app border border-transparent hover:border-border-custom text-txt-secondary hover:text-txt-primary rounded-xl transition duration-200 cursor-pointer"
          >
            <X size={15} />
          </button>

          <div>
            {activeTab === "general" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-extrabold text-txt-primary">General Preferences</h3>
                  <p className="text-[10px] text-txt-secondary mt-0.5">Customize interface styling and look-and-feel.</p>
                </div>

                <div className="space-y-4">
                  {/* Theme Mode */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-txt-primary">Visual Theme</h4>
                      <p className="text-[9px] text-txt-muted mt-0.5">Toggle between light and dark display modes.</p>
                    </div>
                    <div className="flex space-x-1 bg-bg-app p-1 rounded-xl border border-border-custom">
                      <button
                        onClick={() => setSettings({ theme: "light" })}
                        className={`p-1.5 rounded-lg transition duration-150 cursor-pointer ${
                          settings.theme === "light"
                            ? "bg-bg-card text-accent-custom shadow-xs"
                            : "text-txt-muted hover:text-txt-secondary"
                        }`}
                      >
                        <Sun size={14} />
                      </button>
                      <button
                        onClick={() => setSettings({ theme: "dark" })}
                        className={`p-1.5 rounded-lg transition duration-150 cursor-pointer ${
                          settings.theme === "dark"
                            ? "bg-bg-card text-accent-custom shadow-xs"
                            : "text-txt-muted hover:text-txt-secondary"
                        }`}
                      >
                        <Moon size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Font Size Selector */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-txt-primary">Font Sizing</h4>
                      <p className="text-[9px] text-txt-muted mt-0.5">Adjust text layout density for readability.</p>
                    </div>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => setSettings({ fontSize: e.target.value as any })}
                      className="bg-bg-app border border-border-custom rounded-xl px-2.5 py-1 text-xs text-txt-secondary focus:border-accent-custom outline-none"
                    >
                      <option value="sm">Small</option>
                      <option value="md">Normal</option>
                      <option value="lg">Large</option>
                      <option value="xl">Extra Large</option>
                    </select>
                  </div>

                  {/* Animations Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-txt-primary">Interface Animations</h4>
                      <p className="text-[9px] text-txt-muted mt-0.5">Toggle smooth transition and hover liftoff effects.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.animationsEnabled}
                      onChange={(e) => setSettings({ animationsEnabled: e.target.checked })}
                      className="w-4 h-4 text-accent-custom rounded-md bg-bg-app border-border-custom focus:ring-accent-custom"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "model" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-extrabold text-txt-primary">AI Inference Engines</h3>
                  <p className="text-[10px] text-txt-secondary mt-0.5">Configure default models for research queries.</p>
                </div>

                <div className="space-y-4">
                  {/* Model Choice */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-txt-primary">Primary Model</h4>
                      <p className="text-[9px] text-txt-muted mt-0.5">Gemini models connect natively via Google API.</p>
                    </div>
                    <select
                      value={settings.model}
                      onChange={(e) => setSettings({ model: e.target.value })}
                      className="bg-bg-app border border-border-custom rounded-xl px-2.5 py-1 text-xs text-txt-secondary focus:border-accent-custom outline-none"
                    >
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recommended)</option>
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep reasoning)</option>
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast synthesis)</option>
                      <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Coding helper)</option>
                      <option value="gpt-4o">GPT-4o (Generalist)</option>
                    </select>
                  </div>

                  {/* System Instructions info */}
                  <div className="p-3 bg-accent-light rounded-xl text-[9px] leading-relaxed text-txt-secondary border border-accent-custom/10">
                    <p className="font-bold text-accent-custom mb-0.5">Grounding Prompt Architecture</p>
                    All API routes automatically format prompts to prioritize inline citations, tables, and custom layouts to ground response facts.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shortcuts" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-extrabold text-txt-primary">Keyboard Shortcuts</h3>
                  <p className="text-[10px] text-txt-secondary mt-0.5">Speed up your workflow using context keybinds.</p>
                </div>

                <div className="space-y-2 max-w-md">
                  <div className="flex justify-between items-center text-xs py-1 border-b border-border-custom/50">
                    <span className="text-txt-secondary font-medium">Focus Search Input</span>
                    <kbd className="bg-bg-app px-2 py-0.5 rounded border border-border-custom text-[10px] font-mono font-semibold text-txt-primary">/</kbd>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1 border-b border-border-custom/50">
                    <span className="text-txt-secondary font-medium">Global Command Palette</span>
                    <kbd className="bg-bg-app px-2 py-0.5 rounded border border-border-custom text-[10px] font-mono font-semibold text-txt-primary">Ctrl + K</kbd>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1 border-b border-border-custom/50">
                    <span className="text-txt-secondary font-medium">Send Prompt Message</span>
                    <kbd className="bg-bg-app px-2 py-0.5 rounded border border-border-custom text-[10px] font-mono font-semibold text-txt-primary">Ctrl + Enter</kbd>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1 border-b border-border-custom/50">
                    <span className="text-txt-secondary font-medium">Stop Text Stream</span>
                    <kbd className="bg-bg-app px-2 py-0.5 rounded border border-border-custom text-[10px] font-mono font-semibold text-txt-primary">Esc</kbd>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-extrabold text-txt-primary">Workspace Privacy</h3>
                  <p className="text-[10px] text-txt-secondary mt-0.5">Manage data persistence, exports, and accounts.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-txt-primary">Export Workspace</h4>
                      <p className="text-[9px] text-txt-muted mt-0.5">Download all chats as a local JSON file.</p>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="flex items-center space-x-1.5 py-1.5 px-3 bg-bg-app border border-border-custom hover:border-accent-custom/35 text-xs text-txt-secondary hover:text-txt-primary rounded-xl transition font-medium cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Export Data</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-rose-500">Purge Data</h4>
                      <p className="text-[9px] text-txt-muted mt-0.5">Permanently delete all chat transcripts and templates.</p>
                    </div>
                    <button
                      onClick={handleClearData}
                      className="flex items-center space-x-1.5 py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition text-xs font-medium cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete Workspace</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Success Overlay for Purging */}
          {showClearSuccess && (
            <div className="absolute inset-0 bg-bg-card/95 flex flex-col items-center justify-center space-y-2 z-20">
              <CheckCircle size={32} className="text-emerald-500 animate-bounce" />
              <p className="text-xs font-extrabold text-txt-primary">Workspace purged successfully</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
