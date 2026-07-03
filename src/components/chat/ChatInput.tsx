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
      <div className="relative flex items-end w-full bg-bg-card rounded-[26px] hover:shadow-xs transition-all duration-200 py-3 pl-12 pr-12">
        {/* Attachment Icon (ChatGPT style paperclip) */}
        <button
          className="absolute left-3 bottom-3 p-1.5 hover:bg-bg-app/50 text-txt-secondary hover:text-txt-primary rounded-full transition-colors duration-150 cursor-pointer"
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
          className="flex-1 resize-none bg-transparent border-0 outline-none text-txt-primary placeholder:text-txt-secondary text-sm leading-relaxed max-h-[200px]"
          style={{ height: "auto" }}
        />

        {/* Send / Stop Buttons */}
        <div className="absolute right-3 bottom-2.5">
          {isGenerating ? (
            <button
              onClick={onStopGeneration}
              className="p-2 bg-txt-primary text-bg-app hover:opacity-90 rounded-full transition-opacity duration-150 flex items-center justify-center cursor-pointer shadow-xs"
              title="Stop generating"
            >
              <Square size={12} className="fill-bg-app text-bg-app" />
            </button>
          ) : (
            <button
              onClick={onSendMessage}
              disabled={!text.trim()}
              className={`p-2 rounded-full transition duration-150 flex items-center justify-center shadow-xs ${
                text.trim()
                  ? "bg-txt-primary text-bg-app hover:opacity-90 cursor-pointer"
                  : "bg-border-custom text-txt-secondary/40 cursor-not-allowed"
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
