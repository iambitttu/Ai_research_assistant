"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ChatInput from "@/components/chat/ChatInput";
import MessageItem from "@/components/chat/MessageItem";
import SettingsDialog from "@/components/settings/SettingsDialog";
import { useChatStore } from "@/store/chatStore";
import { Message } from "@/types/chat";
import { Sparkles, Map, Mail, Code, Lightbulb } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const LANDING_SUGGESTIONS = [
  {
    title: "Plan a trip",
    subtitle: "Help me plan a 5-day trip to Tokyo",
    prompt: "Can you help me plan a 5-day itinerary for a trip to Tokyo? I like historic temples, local street food, and modern gadgets.",
    icon: Map,
  },
  {
    title: "Help me write",
    subtitle: "Write a polite email asking for feedback",
    prompt: "Write a short, polite email to a client requesting feedback on the project prototype we delivered yesterday.",
    icon: Mail,
  },
  {
    title: "Explain code",
    subtitle: "How does recursion work in JavaScript?",
    prompt: "Explain how recursion works in JavaScript using a simple, real-world analogy and a short code example.",
    icon: Code,
  },
  {
    title: "Brainstorm ideas",
    subtitle: "Suggest creative names for an AI startup",
    prompt: "Brainstorm 10 creative, modern, and memorable names for a new startup focused on AI productivity tools.",
    icon: Lightbulb,
  },
];

export default function Page() {
  const {
    conversations,
    activeId,
    settings,
    isGenerating,
    createNewConversation,
    addMessage,
    updateMessage,
    setIsGenerating,
  } = useChatStore();

  const [text, setText] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeId);
  const messages = activeConversation?.messages || [];
  const isLanding = messages.length === 0;

  // Sync theme class
  useEffect(() => {
    const html = document.documentElement;
    if (settings.theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [settings.theme]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Focus and key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }

      if (e.key === "Escape" && isGenerating) {
        handleStopGeneration();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGenerating]);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
  };

  const handleSuggestionClick = (promptText: string) => {
    setText(promptText);
    inputRef.current?.focus();
  };

  const handleSend = async (overrideText?: string) => {
    const promptText = (overrideText || text).trim();
    if (!promptText) return;

    let currentConvId = activeId;
    if (!currentConvId || messages.length === 0) {
      currentConvId = createNewConversation(promptText, "general");
    }

    setText("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    // 1. User Message
    const userMsgId = Math.random().toString(36).substring(2, 15);
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: promptText,
      timestamp: Date.now(),
    };
    addMessage(currentConvId, userMsg);
    setIsGenerating(true);

    // 2. Assistant Message Placeholder
    const assistantMsgId = Math.random().toString(36).substring(2, 15);
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };
    addMessage(currentConvId, assistantMsg);

    // 3. API Request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          model: settings.model,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const textChunk = decoder.decode(value, { stream: !done });
          accumulatedText += textChunk;
          updateMessage(currentConvId, assistantMsgId, { content: accumulatedText });
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream generation aborted.");
      } else {
        console.error(err);
        updateMessage(currentConvId, assistantMsgId, {
          content: `Failed to compile response. Error details:\n\n\`\`\`\n${err.message}\n\`\`\``,
          isError: true,
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-app select-none text-txt-primary transition-colors duration-200">
      {/* Collapsible Left Sidebar */}
      <AnimatePresence initial={false}>
        {!sidebarCollapsed && (
          <Sidebar
            isCollapsed={sidebarCollapsed}
            setIsCollapsed={setSidebarCollapsed}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-bg-app relative">
        {/* Header */}
        <Header
          isSidebarCollapsed={sidebarCollapsed}
          setIsSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Main Layout Area */}
        <div className="flex-1 flex flex-col min-h-0 relative justify-between">
          
          {/* Scroll Container */}
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin">
            {isLanding ? (
              /* Centered Landing View */
              <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full text-center">
                <div className="w-10 h-10 rounded-full bg-accent-custom flex items-center justify-center text-white mb-5 animate-fade-in shadow-sm select-none">
                  <Sparkles size={18} />
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-txt-primary mb-8 select-none animate-fade-in">
                  How can I help you today?
                </h1>

                {/* Suggestions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full animate-fade-in mt-4">
                  {LANDING_SUGGESTIONS.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(item.prompt)}
                        className="p-3.5 text-left border border-border-custom/40 bg-bg-card/30 hover:bg-bg-card rounded-2xl cursor-pointer transition duration-150 flex items-start space-x-3 group"
                      >
                        <div className="p-2 bg-bg-card border border-border-custom/50 rounded-xl text-txt-secondary group-hover:text-accent-custom transition duration-150 shrink-0">
                          <Icon size={14} />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-txt-primary">{item.title}</h4>
                          <p className="text-[10.5px] text-txt-secondary mt-0.5 truncate">{item.subtitle}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Messages List */
              <div className="max-w-2xl mx-auto w-full space-y-6 flex-1">
                {messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    onRegenerate={() => handleSend(message.content)}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div
            className={`p-4 md:p-6 shrink-0 transition-all duration-500 ease-in-out ${
              isLanding
                ? "mb-[14vh] md:mb-[16vh] w-full"
                : "w-full border-t border-border-custom/30 bg-bg-app"
            }`}
          >
            <ChatInput
              text={text}
              setText={setText}
              onSendMessage={() => handleSend()}
              onStopGeneration={handleStopGeneration}
              inputRef={inputRef}
            />
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsDialog
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
