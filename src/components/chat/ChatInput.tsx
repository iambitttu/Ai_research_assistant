"use client";

import React, { useRef, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { ArrowUp, Square } from "lucide-react";

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
    // Auto resize
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(220, textarea.scrollHeight)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <div className="relative flex items-end w-full border border-border-custom bg-bg-app rounded-[20px] shadow-sm hover:shadow-md focus-within:border-accent-custom focus-within:shadow-md transition-all duration-200 py-3 pl-4 pr-14">
        {/* Input Textarea */}
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="flex-1 resize-none bg-transparent border-0 outline-none text-txt-primary placeholder:text-txt-secondary text-sm leading-relaxed max-h-[220px]"
          style={{ height: "auto" }}
        />

        {/* Send / Stop Buttons */}
        <div className="absolute right-3 bottom-2.5">
          {isGenerating ? (
            <button
              onClick={onStopGeneration}
              className="p-2 bg-txt-primary text-bg-app hover:opacity-90 rounded-full transition-opacity duration-150 flex items-center justify-center"
              title="Stop generating"
            >
              <Square size={13} className="fill-bg-app text-bg-app" />
            </button>
          ) : (
            <button
              onClick={onSendMessage}
              disabled={!text.trim()}
              className={`p-2 rounded-full transition duration-200 flex items-center justify-center ${
                text.trim()
                  ? "bg-txt-primary text-bg-app hover:opacity-90 cursor-pointer"
                  : "bg-border-custom text-txt-secondary cursor-not-allowed"
              }`}
              title="Send message"
            >
              <ArrowUp size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
