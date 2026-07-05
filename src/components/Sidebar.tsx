"use client";

import React, { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { Conversation } from "@/types/chat";
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Sliders,
  User,
  PanelLeftClose,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  onOpenSettings: () => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  onOpenSettings,
}: SidebarProps) {
  const {
    conversations,
    activeId,
    setActiveId,
    createNewConversation,
    deleteConversation,
    renameConversation,
  } = useChatStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleStartRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      renameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") handleSaveRename(id);
    if (e.key === "Escape") setEditingId(null);
  };

  if (isCollapsed) return null;

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 260 }}
      exit={{ width: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen bg-bg-sidebar border-r border-border-custom flex flex-col relative z-20 select-none overflow-hidden shrink-0"
    >
      {/* Sidebar Header */}
      <div className="p-3.5 flex items-center justify-between h-14">
        <button
          onClick={() => createNewConversation()}
          className="flex-1 flex items-center space-x-2 py-2 px-3 bg-gradient-to-tr from-accent-indigo/10 to-accent-purple/10 border border-accent-indigo/25 hover:from-accent-indigo/15 hover:to-accent-purple/15 text-accent-indigo dark:text-indigo-400 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs cursor-pointer"
        >
          <Plus size={14} className="text-accent-indigo dark:text-indigo-400" />
          <span>New Chat</span>
        </button>
        
        <button
          onClick={() => setIsCollapsed(true)}
          className="ml-2 p-2 hover:bg-bg-card text-txt-secondary hover:text-txt-primary rounded-xl transition-colors duration-150 cursor-pointer"
          title="Close sidebar"
        >
          <PanelLeftClose size={15} />
        </button>
      </div>

      {/* Conversations History List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 scrollbar-thin">
        <div className="px-2 text-[10px] font-bold text-txt-secondary uppercase tracking-wider mb-2">
          History
        </div>

        {conversations.length === 0 ? (
          <div className="px-3 py-4 text-[10px] text-txt-secondary font-medium italic">
            No active conversations.
          </div>
        ) : (
          conversations.map((chat) => {
            const isSelected = chat.id === activeId;
            const isEditing = chat.id === editingId;

            return (
              <div
                key={chat.id}
                className={`group relative flex items-center rounded-xl cursor-pointer text-xs transition-all duration-200 px-3 py-2.5 ${
                  isSelected
                    ? "bg-accent-indigo/10 text-accent-indigo dark:bg-accent-indigo/15 dark:text-indigo-400 font-bold shadow-xs"
                    : "text-txt-secondary hover:bg-bg-card/50 hover:text-txt-primary"
                }`}
                onClick={() => !isEditing && setActiveId(chat.id)}
              >
                <MessageSquare size={13} className={`mr-2.5 shrink-0 ${isSelected ? "text-accent-indigo dark:text-indigo-400" : "text-txt-secondary"}`} />

                {isEditing ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, chat.id)}
                    onBlur={() => handleSaveRename(chat.id)}
                    autoFocus
                    className="flex-1 bg-transparent border-0 outline-none p-0 text-xs text-txt-primary focus:ring-0"
                  />
                ) : (
                  <span className="truncate pr-12 flex-1">{chat.title}</span>
                )}

                {/* Edit & Delete Action Panel */}
                {!isEditing && isSelected && (
                  <div className="absolute right-2 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartRename(chat.id, chat.title);
                      }}
                      className="p-0.5 hover:text-txt-primary rounded transition-colors"
                    >
                      <Edit3 size={11} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this conversation?")) {
                          deleteConversation(chat.id);
                        }
                      }}
                      className="p-0.5 hover:text-rose-500 rounded transition-colors"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-border-custom bg-bg-sidebar p-3.5 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-indigo to-accent-purple text-white flex items-center justify-center shrink-0 shadow-md">
              <User size={14} />
            </div>
            <div className="truncate w-[120px]">
              <p className="text-xs font-bold text-txt-primary truncate">Bittu Kumar</p>
              <p className="text-[10px] text-txt-secondary truncate">Free Account</p>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-bg-card text-txt-secondary hover:text-accent-indigo hover:scale-105 rounded-xl transition-all duration-200 cursor-pointer"
            title="Settings"
          >
            <Sliders size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
