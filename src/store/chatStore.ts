import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Conversation,
  Message,
  AppSettings,
  SearchMode,
  FileChip,
  Folder,
  Project,
  Source,
} from "@/types/chat";

interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  folders: Folder[];
  projects: Project[];
  settings: AppSettings;
  searchMode: SearchMode;
  activeUploads: FileChip[];
  isGenerating: boolean;
  currentSearchProgress: string | null;
  
  // Actions
  setTheme: (theme: "light" | "dark") => void;
  setSettings: (settings: Partial<AppSettings>) => void;
  setSearchMode: (mode: SearchMode) => void;
  setActiveId: (id: string | null) => void;
  createNewConversation: (initialMessage?: string, mode?: SearchMode) => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  togglePinConversation: (id: string) => void;
  toggleArchiveConversation: (id: string) => void;
  duplicateConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  addUpload: (file: FileChip) => void;
  updateUpload: (id: string, updates: Partial<FileChip>) => void;
  removeUpload: (id: string) => void;
  clearUploads: () => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setCurrentSearchProgress: (progress: string | null) => void;
  addFolder: (name: string) => void;
  addProject: (name: string) => void;
  assignFolder: (conversationId: string, folderId?: string) => void;
  assignProject: (conversationId: string, projectId?: string) => void;
  clearAllData: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  model: "gemini-2.5-flash",
  fontSize: "md",
  sidebarWidth: 260,
  animationsEnabled: true,
  notificationsEnabled: true,
  keyboardShortcutsEnabled: true,
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeId: null,
      folders: [
        { id: "research", name: "Academic Research" },
        { id: "coding", name: "Side Projects" },
      ],
      projects: [
        { id: "proj-1", name: "Aethera AI Sandbox" },
      ],
      settings: DEFAULT_SETTINGS,
      searchMode: "general",
      activeUploads: [],
      isGenerating: false,
      currentSearchProgress: null,

      setTheme: (theme) => {
        set((state) => {
          const html = document.documentElement;
          if (theme === "dark") {
            html.classList.add("dark");
          } else {
            html.classList.remove("dark");
          }
          return { settings: { ...state.settings, theme } };
        });
      },

      setSettings: (newSettings) =>
        set((state) => {
          if (newSettings.theme) {
            const html = document.documentElement;
            if (newSettings.theme === "dark") {
              html.classList.add("dark");
            } else {
              html.classList.remove("dark");
            }
          }
          return { settings: { ...state.settings, ...newSettings } };
        }),

      setSearchMode: (searchMode) => set({ searchMode }),

      setActiveId: (activeId) => set({ activeId, activeUploads: [] }),

      createNewConversation: (initialMessage, mode) => {
        const id = Math.random().toString(36).substring(2, 15);
        const newConv: Conversation = {
          id,
          title: initialMessage ? (initialMessage.length > 30 ? initialMessage.substring(0, 30) + "..." : initialMessage) : "New Chat",
          messages: [],
          pinned: false,
          archived: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          conversations: [newConv, ...state.conversations],
          activeId: id,
          activeUploads: [],
        }));

        if (mode) {
          set({ searchMode: mode });
        }

        return id;
      },

      deleteConversation: (id) =>
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id);
          let nextActive = state.activeId;
          if (state.activeId === id) {
            nextActive = filtered.length > 0 ? filtered[0].id : null;
          }
          return {
            conversations: filtered,
            activeId: nextActive,
          };
        }),

      renameConversation: (id, title) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title, updatedAt: Date.now() } : c
          ),
        })),

      togglePinConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, pinned: !c.pinned, updatedAt: Date.now() } : c
          ),
        })),

      toggleArchiveConversation: (id) =>
        set((state) => {
          const conversations = state.conversations.map((c) =>
            c.id === id ? { ...c, archived: !c.archived, updatedAt: Date.now() } : c
          );
          let nextActive = state.activeId;
          if (state.activeId === id) {
            const activeConv = conversations.find((c) => c.id === id);
            if (activeConv?.archived) {
              const visible = conversations.filter((c) => !c.archived);
              nextActive = visible.length > 0 ? visible[0].id : null;
            }
          }
          return { conversations, activeId: nextActive };
        }),

      duplicateConversation: (id) =>
        set((state) => {
          const target = state.conversations.find((c) => c.id === id);
          if (!target) return {};
          const newId = Math.random().toString(36).substring(2, 15);
          const duplicate: Conversation = {
            ...target,
            id: newId,
            title: `${target.title} (Copy)`,
            pinned: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: target.messages.map((m) => ({ ...m, id: Math.random().toString(36).substring(2, 15) })),
          };
          return {
            conversations: [duplicate, ...state.conversations],
            activeId: newId,
          };
        }),

      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  updatedAt: Date.now(),
                  title: c.messages.length === 0 && message.role === "user" 
                    ? (message.content.length > 30 ? message.content.substring(0, 30) + "..." : message.content)
                    : c.title
                }
              : c
          ),
        })),

      updateMessage: (conversationId, messageId, updates) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, ...updates } : m
                  ),
                  updatedAt: Date.now(),
                }
              : c
          ),
        })),

      addUpload: (file) =>
        set((state) => ({
          activeUploads: [...state.activeUploads, file],
        })),

      updateUpload: (id, updates) =>
        set((state) => ({
          activeUploads: state.activeUploads.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),

      removeUpload: (id) =>
        set((state) => ({
          activeUploads: state.activeUploads.filter((f) => f.id !== id),
        })),

      clearUploads: () => set({ activeUploads: [] }),

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      setCurrentSearchProgress: (currentSearchProgress) => set({ currentSearchProgress }),

      addFolder: (name) =>
        set((state) => ({
          folders: [
            ...state.folders,
            { id: Math.random().toString(36).substring(2, 15), name },
          ],
        })),

      addProject: (name) =>
        set((state) => ({
          projects: [
            ...state.projects,
            { id: Math.random().toString(36).substring(2, 15), name },
          ],
        })),

      assignFolder: (conversationId, folderId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, folderId, updatedAt: Date.now() } : c
          ),
        })),

      assignProject: (conversationId, projectId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, projectId, updatedAt: Date.now() } : c
          ),
        })),

      clearAllData: () => set({ conversations: [], activeId: null, activeUploads: [], isGenerating: false }),
    }),
    {
      name: "aethera-chat-store",
      partialize: (state) => ({
        conversations: state.conversations,
        folders: state.folders,
        projects: state.projects,
        settings: state.settings,
      }),
    }
  )
);
