"use client";

import React, { useRef, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { ArrowUp, Square, Paperclip } from "lucide-react";

interface ChatInputProps {
  text: string;
  setText: (val: string) => void;
  onSendMessage: () => void;
  onStopGeneration?: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export default function ChatInput({
  text,
  setText,
  onSendMessage,
  onStopGeneration,
  inputRef,
}: ChatInputProps) {
  const { isGenerating } = useChatStore();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(200, textarea.scrollHeight)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative px-4">
      <div className="relative flex items-end w-full bg-bg-card/45 border border-border-custom/75 focus-within:border-accent-indigo/60 focus-within:ring-3 focus-within:ring-accent-indigo/15 rounded-[26px] hover:shadow-md transition-all duration-300 py-3 pl-12 pr-12 backdrop-blur-md">
        {/* Attachment Icon (ChatGPT style paperclip) */}
        <button
          className="absolute left-3.5 bottom-2.5 p-1.5 hover:bg-bg-card text-txt-secondary hover:text-txt-primary rounded-full transition-colors duration-200 cursor-pointer"
          title="Attach files (mock)"
        >
          <Paperclip size={16} />
        </button>

        {/* Input Textarea */}
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Message Aethera..."
          className="flex-1 resize-none bg-transparent border-0 outline-none text-txt-primary placeholder:text-txt-secondary/60 text-sm leading-relaxed max-h-[200px] py-1"
          style={{ height: "auto" }}
        />

        {/* Send / Stop Buttons */}
        <div className="absolute right-3.5 bottom-2.5">
          {isGenerating ? (
            <button
              onClick={onStopGeneration}
              className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition duration-200 flex items-center justify-center cursor-pointer shadow-md shadow-rose-500/20 animate-pulse"
              title="Stop generating"
            >
              <Square size={10} className="fill-white text-white" />
            </button>
          ) : (
            <button
              onClick={onSendMessage}
              disabled={!text.trim()}
              className={`p-2 rounded-full transition duration-200 flex items-center justify-center shadow-md ${
                text.trim()
                  ? "bg-gradient-to-tr from-accent-indigo to-accent-purple text-white hover:scale-105 active:scale-95 cursor-pointer shadow-accent-indigo/15"
                  : "bg-border-custom/50 text-txt-secondary/30 cursor-not-allowed shadow-none"
              }`}
              title="Send message"
            >
              <ArrowUp size={13} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
