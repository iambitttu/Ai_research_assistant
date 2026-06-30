"use client";

import React, { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { Conversation } from "@/types/chat";
import {
  MessageSquare,
  Plus,
  Search,
  Pin,
  Folder,
  FolderOpen,
  Briefcase,
  Settings,
  User,
  PanelLeftClose,
  PanelLeft,
  Database,
  Trash2,
  MoreHorizontal,
  FolderPlus,
  Archive,
  Copy,
  PenBox,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
    folders,
    projects,
    setActiveId,
    createNewConversation,
    deleteConversation,
    renameConversation,
    togglePinConversation,
    toggleArchiveConversation,
    duplicateConversation,
    assignFolder,
    assignProject,
    addFolder,
    addProject,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [showProjectInput, setShowProjectInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const filteredConversations = conversations.filter(
    (c) =>
      !c.archived &&
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredConversations.filter((c) => c.pinned);
  const recentChats = filteredConversations.filter((c) => !c.pinned);

  // Group by Folders/Projects
  const getFolderChats = (folderId: string) =>
    filteredConversations.filter((c) => c.folderId === folderId);

  const getProjectChats = (projectId: string) =>
    filteredConversations.filter((c) => c.projectId === projectId);

  const handleCreateChat = () => {
    createNewConversation();
  };

  const handleStartRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
    setActiveMenuId(null);
  };

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      renameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleKeyDownRename = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      handleSaveRename(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  const handleAddFolder = () => {
    if (newGroupName.trim()) {
      addFolder(newGroupName.trim());
      setNewGroupName("");
      setShowFolderInput(false);
    }
  };

  const handleAddProject = () => {
    if (newGroupName.trim()) {
      addProject(newGroupName.trim());
      setNewGroupName("");
      setShowProjectInput(false);
    }
  };

  // Estimate storage usage based on local storage size
  const totalMessagesCount = conversations.reduce((acc, c) => acc + c.messages.length, 0);
  const storagePercentage = Math.min(100, Math.max(5, Math.round((totalMessagesCount / 1000) * 100)));

  return (
    <motion.div
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-bg-card border-r border-border-custom flex flex-col relative z-20 select-none overflow-hidden"
    >
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between border-b border-border-custom h-[64px]">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-accent-indigo to-accent-purple flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-black tracking-wider">AE</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-txt-primary">Aethera AI</span>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-indigo to-accent-purple flex items-center justify-center shadow-md mx-auto">
            <span className="text-white text-[10px] font-black">AE</span>
          </div>
        )}

        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 hover:bg-accent-indigo-light text-txt-secondary hover:text-txt-primary rounded-lg transition duration-200"
          >
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={handleCreateChat}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-3 bg-accent-indigo hover:bg-indigo-600 text-white rounded-xl shadow-sm hover:shadow-md transition duration-200 font-medium text-xs`}
        >
          <Plus size={16} />
          {!isCollapsed && <span>New Thread</span>}
        </button>
      </div>

      {/* Global Search Chat Input */}
      {!isCollapsed && (
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 text-txt-muted" size={14} />
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-bg-app border border-border-custom rounded-xl focus:border-accent-indigo outline-none text-txt-primary transition placeholder:text-txt-muted"
            />
          </div>
        </div>
      )}

      {/* Navigation Areas */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 py-2 scrollbar-thin">
        {/* Pinned Section */}
        {pinnedChats.length > 0 && (
          <div>
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-semibold text-txt-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Pin size={10} className="rotate-45" /> Pinned
              </p>
            )}
            <div className="space-y-0.5">
              {pinnedChats.map((chat) => (
                <SidebarChatItem
                  key={chat.id}
                  chat={chat}
                  isCollapsed={isCollapsed}
                  activeId={activeId}
                  editingId={editingId}
                  editingTitle={editingTitle}
                  activeMenuId={activeMenuId}
                  folders={folders}
                  projects={projects}
                  setEditingTitle={setEditingTitle}
                  setActiveId={setActiveId}
                  handleKeyDownRename={handleKeyDownRename}
                  handleStartRename={handleStartRename}
                  togglePinConversation={togglePinConversation}
                  toggleArchiveConversation={toggleArchiveConversation}
                  duplicateConversation={duplicateConversation}
                  deleteConversation={deleteConversation}
                  setActiveMenuId={setActiveMenuId}
                  assignFolder={assignFolder}
                  assignProject={assignProject}
                />
              ))}
            </div>
          </div>
        )}

        {/* Folders Section */}
        {!isCollapsed && (
          <div>
            <div className="px-3 flex items-center justify-between text-[10px] font-semibold text-txt-muted uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <FolderOpen size={10} /> Folders
              </span>
              <button
                onClick={() => setShowFolderInput(!showFolderInput)}
                className="hover:text-txt-primary transition"
              >
                <FolderPlus size={12} />
              </button>
            </div>

            {showFolderInput && (
              <div className="px-3 py-1.5 flex gap-1">
                <input
                  type="text"
                  placeholder="Folder name..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs bg-bg-app border border-border-custom rounded-lg focus:border-accent-indigo outline-none"
                />
                <button
                  onClick={handleAddFolder}
                  className="px-2 py-1 text-[10px] bg-accent-indigo text-white rounded-lg hover:bg-indigo-600"
                >
                  Add
                </button>
              </div>
            )}

            <div className="space-y-1">
              {folders.map((folder) => {
                const folderChats = getFolderChats(folder.id);
                return (
                  <div key={folder.id} className="space-y-0.5 px-1">
                    <div className="flex items-center space-x-1.5 py-1 px-2 text-xs font-medium text-txt-secondary rounded-lg">
                      <Folder size={12} className="text-accent-indigo/70" />
                      <span className="truncate flex-1">{folder.name}</span>
                      <span className="text-[9px] bg-accent-indigo-light text-accent-indigo px-1.5 py-0.2 rounded-full">
                        {folderChats.length}
                      </span>
                    </div>
                    {folderChats.map((chat) => (
                      <SidebarChatItem
                        key={chat.id}
                        chat={chat}
                        isCollapsed={isCollapsed}
                        activeId={activeId}
                        editingId={editingId}
                        editingTitle={editingTitle}
                        activeMenuId={activeMenuId}
                        folders={folders}
                        projects={projects}
                        setEditingTitle={setEditingTitle}
                        setActiveId={setActiveId}
                        handleKeyDownRename={handleKeyDownRename}
                        handleStartRename={handleStartRename}
                        togglePinConversation={togglePinConversation}
                        toggleArchiveConversation={toggleArchiveConversation}
                        duplicateConversation={duplicateConversation}
                        deleteConversation={deleteConversation}
                        setActiveMenuId={setActiveMenuId}
                        assignFolder={assignFolder}
                        assignProject={assignProject}
                        isSubItem
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {!isCollapsed && (
          <div>
            <div className="px-3 flex items-center justify-between text-[10px] font-semibold text-txt-muted uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <Briefcase size={10} /> Projects
              </span>
              <button
                onClick={() => setShowProjectInput(!showProjectInput)}
                className="hover:text-txt-primary transition"
              >
                <Plus size={12} />
              </button>
            </div>

            {showProjectInput && (
              <div className="px-3 py-1.5 flex gap-1">
                <input
                  type="text"
                  placeholder="Project name..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs bg-bg-app border border-border-custom rounded-lg focus:border-accent-indigo outline-none"
                />
                <button
                  onClick={handleAddProject}
                  className="px-2 py-1 text-[10px] bg-accent-indigo text-white rounded-lg hover:bg-indigo-600"
                >
                  Add
                </button>
              </div>
            )}

            <div className="space-y-1">
              {projects.map((proj) => {
                const projChats = getProjectChats(proj.id);
                return (
                  <div key={proj.id} className="space-y-0.5 px-1">
                    <div className="flex items-center space-x-1.5 py-1 px-2 text-xs font-medium text-txt-secondary rounded-lg">
                      <Briefcase size={12} className="text-accent-purple/70" />
                      <span className="truncate flex-1">{proj.name}</span>
                      <span className="text-[9px] bg-accent-indigo-light text-accent-purple px-1.5 py-0.2 rounded-full">
                        {projChats.length}
                      </span>
                    </div>
                    {projChats.map((chat) => (
                      <SidebarChatItem
                        key={chat.id}
                        chat={chat}
                        isCollapsed={isCollapsed}
                        activeId={activeId}
                        editingId={editingId}
                        editingTitle={editingTitle}
                        activeMenuId={activeMenuId}
                        folders={folders}
                        projects={projects}
                        setEditingTitle={setEditingTitle}
                        setActiveId={setActiveId}
                        handleKeyDownRename={handleKeyDownRename}
                        handleStartRename={handleStartRename}
                        togglePinConversation={togglePinConversation}
                        toggleArchiveConversation={toggleArchiveConversation}
                        duplicateConversation={duplicateConversation}
                        deleteConversation={deleteConversation}
                        setActiveMenuId={setActiveMenuId}
                        assignFolder={assignFolder}
                        assignProject={assignProject}
                        isSubItem
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Chats Section */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-semibold text-txt-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MessageSquare size={10} /> Threads
            </p>
          )}
          <div className="space-y-0.5">
            {recentChats
              .filter((chat) => !chat.folderId && !chat.projectId)
              .map((chat) => (
                <SidebarChatItem
                  key={chat.id}
                  chat={chat}
                  isCollapsed={isCollapsed}
                  activeId={activeId}
                  editingId={editingId}
                  editingTitle={editingTitle}
                  activeMenuId={activeMenuId}
                  folders={folders}
                  projects={projects}
                  setEditingTitle={setEditingTitle}
                  setActiveId={setActiveId}
                  handleKeyDownRename={handleKeyDownRename}
                  handleStartRename={handleStartRename}
                  togglePinConversation={togglePinConversation}
                  toggleArchiveConversation={toggleArchiveConversation}
                  duplicateConversation={duplicateConversation}
                  deleteConversation={deleteConversation}
                  setActiveMenuId={setActiveMenuId}
                  assignFolder={assignFolder}
                  assignProject={assignProject}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="mt-auto border-t border-border-custom bg-bg-card p-3 space-y-3">
        {/* Storage Indicator */}
        {!isCollapsed && (
          <div className="px-1.5">
            <div className="flex items-center justify-between text-[10px] text-txt-secondary mb-1">
              <span className="flex items-center gap-1"><Database size={10} /> Memory Index</span>
              <span>{storagePercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-accent-indigo-light rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${storagePercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-accent-indigo to-accent-purple rounded-full"
              />
            </div>
          </div>
        )}

        {/* Profile / Settings */}
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-accent-indigo-light border border-accent-indigo/20 flex items-center justify-center overflow-hidden">
              <User size={14} className="text-accent-indigo" />
            </div>
            {!isCollapsed && (
              <div className="truncate w-[120px]">
                <p className="text-xs font-semibold text-txt-primary truncate">Bittu Kumar</p>
                <p className="text-[10px] text-txt-muted truncate">Premium Tier</p>
              </div>
            )}
          </div>

          {!isCollapsed ? (
            <button
              onClick={onOpenSettings}
              className="p-1.5 hover:bg-accent-indigo-light text-txt-secondary hover:text-txt-primary rounded-lg transition duration-200"
            >
              <Settings size={15} />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 hover:bg-accent-indigo-light text-txt-secondary hover:text-txt-primary rounded-lg transition duration-200 mt-1"
            >
              <PanelLeft size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* Chat Item Sub-component */
interface SidebarChatItemProps {
  chat: Conversation;
  isCollapsed: boolean;
  activeId: string | null;
  editingId: string | null;
  editingTitle: string;
  activeMenuId: string | null;
  folders: any[];
  projects: any[];
  setEditingTitle: (val: string) => void;
  setActiveId: (id: string) => void;
  handleKeyDownRename: (e: React.KeyboardEvent, id: string) => void;
  handleStartRename: (id: string, title: string) => void;
  togglePinConversation: (id: string) => void;
  toggleArchiveConversation: (id: string) => void;
  duplicateConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  setActiveMenuId: (id: string | null) => void;
  assignFolder: (cid: string, fid?: string) => void;
  assignProject: (cid: string, pid?: string) => void;
  isSubItem?: boolean;
}

function SidebarChatItem({
  chat,
  isCollapsed,
  activeId,
  editingId,
  editingTitle,
  activeMenuId,
  folders,
  projects,
  setEditingTitle,
  setActiveId,
  handleKeyDownRename,
  handleStartRename,
  togglePinConversation,
  toggleArchiveConversation,
  duplicateConversation,
  deleteConversation,
  setActiveMenuId,
  assignFolder,
  assignProject,
  isSubItem = false,
}: SidebarChatItemProps) {
  const isSelected = activeId === chat.id;

  return (
    <div className={`group/item relative ${isSubItem ? "pl-4" : ""}`}>
      {editingId === chat.id ? (
        <div className="px-2 py-1">
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onKeyDown={(e) => handleKeyDownRename(e, chat.id)}
            onBlur={() => handleKeyDownRename({ key: "Enter" } as any, chat.id)}
            autoFocus
            className="w-full px-2 py-1 text-xs bg-bg-app border border-accent-indigo rounded-lg outline-none text-txt-primary"
          />
        </div>
      ) : (
        <div
          onClick={() => setActiveId(chat.id)}
          className={`flex items-center space-x-2 py-2 px-2.5 rounded-xl cursor-pointer text-xs transition duration-150 ${
            isSelected
              ? "bg-accent-indigo-light text-accent-indigo font-medium"
              : "text-txt-secondary hover:bg-bg-app hover:text-txt-primary"
          }`}
        >
          {chat.pinned ? (
            <Pin size={12} className="text-accent-indigo shrink-0 rotate-45" />
          ) : (
            <MessageSquare size={12} className="shrink-0 text-txt-muted group-hover/item:text-txt-secondary" />
          )}

          {!isCollapsed && <span className="truncate flex-1 pr-6">{chat.title}</span>}

          {!isCollapsed && (
            <div className="absolute right-2 opacity-0 group-hover/item:opacity-100 flex items-center transition">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(activeMenuId === chat.id ? null : chat.id);
                }}
                className="p-1 hover:bg-border-custom text-txt-secondary rounded-lg transition"
              >
                <MoreHorizontal size={12} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Context Menu Overlay */}
      <AnimatePresence>
        {activeMenuId === chat.id && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setActiveMenuId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              className="absolute left-6 top-7 z-40 w-48 bg-bg-card border border-border-custom shadow-xl rounded-xl py-1.5 text-xs text-txt-secondary"
            >
              <button
                onClick={() => handleStartRename(chat.id, chat.title)}
                className="w-full text-left px-3 py-1.5 hover:bg-bg-app hover:text-txt-primary flex items-center space-x-2"
              >
                <PenBox size={13} />
                <span>Rename</span>
              </button>

              <button
                onClick={() => {
                  togglePinConversation(chat.id);
                  setActiveMenuId(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-bg-app hover:text-txt-primary flex items-center space-x-2"
              >
                <Pin size={13} />
                <span>{chat.pinned ? "Unpin" : "Pin to Sidebar"}</span>
              </button>

              <button
                onClick={() => {
                  duplicateConversation(chat.id);
                  setActiveMenuId(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-bg-app hover:text-txt-primary flex items-center space-x-2"
              >
                <Copy size={13} />
                <span>Duplicate</span>
              </button>

              <button
                onClick={() => {
                  toggleArchiveConversation(chat.id);
                  setActiveMenuId(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-bg-app hover:text-txt-primary flex items-center space-x-2"
              >
                <Archive size={13} />
                <span>Archive</span>
              </button>

              {/* Move to Folder */}
              <div className="border-t border-border-custom my-1" />
              <div className="px-3 py-1 text-[10px] font-bold text-txt-muted uppercase">Move to Folder</div>
              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    assignFolder(chat.id, chat.folderId === f.id ? undefined : f.id);
                    setActiveMenuId(null);
                  }}
                  className={`w-full text-left px-5 py-1 hover:bg-bg-app hover:text-txt-primary flex items-center justify-between ${
                    chat.folderId === f.id ? "text-accent-indigo" : ""
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  {chat.folderId === f.id && <span className="text-[10px]">✓</span>}
                </button>
              ))}

              {/* Move to Project */}
              <div className="border-t border-border-custom my-1" />
              <div className="px-3 py-1 text-[10px] font-bold text-txt-muted uppercase">Assign Project</div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    assignProject(chat.id, chat.projectId === p.id ? undefined : p.id);
                    setActiveMenuId(null);
                  }}
                  className={`w-full text-left px-5 py-1 hover:bg-bg-app hover:text-txt-primary flex items-center justify-between ${
                    chat.projectId === p.id ? "text-accent-purple" : ""
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  {chat.projectId === p.id && <span className="text-[10px]">✓</span>}
                </button>
              ))}

              <div className="border-t border-border-custom my-1" />
              <button
                onClick={() => {
                  deleteConversation(chat.id);
                  setActiveMenuId(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-rose-500/10 hover:text-rose-500 flex items-center space-x-2 text-rose-500"
              >
                <Trash2 size={13} />
                <span>Delete Thread</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
