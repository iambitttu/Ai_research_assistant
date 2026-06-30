export interface FileChip {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  progress: number;
  status: "uploading" | "completed" | "failed";
}

export interface Source {
  title: string;
  url: string;
  snippet: string;
  favicon?: string;
  domain: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  sources?: Source[];
  suggestions?: string[];
  reasoning?: string;
  isError?: boolean;
  files?: FileChip[];
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
}

export interface Project {
  id: string;
  name: string;
  color?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  pinned: boolean;
  archived: boolean;
  folderId?: string;
  projectId?: string;
  createdAt: number;
  updatedAt: number;
}

export type SearchMode =
  | "general"
  | "research"
  | "coding"
  | "writing"
  | "math"
  | "data"
  | "creative"
  | "reasoning";

export interface AppSettings {
  theme: "light" | "dark";
  model: string;
  fontSize: "sm" | "md" | "lg" | "xl";
  sidebarWidth: number;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  keyboardShortcutsEnabled: boolean;
}
