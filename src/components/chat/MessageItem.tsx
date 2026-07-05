"use client";

import React, { useState } from "react";
import { Message } from "@/types/chat";
import CodeBlock from "./CodeBlock";
import { Copy, Check, RefreshCw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageItemProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

export default function MessageItem({
  message,
  isStreaming = false,
  onRegenerate,
}: MessageItemProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`flex w-full mb-8 ${isUser ? "justify-end" : "justify-start animate-fade-in"}`}>
      <div className={`flex items-start space-x-4 max-w-[85%] sm:max-w-[80%] ${isUser ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
        {/* Avatar for AI response */}
        {!isUser && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-indigo to-accent-purple text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles size={14} className="animate-pulse" />
          </div>
        )}

        {/* Message Box */}
        <div className="flex flex-col flex-1 min-w-0">
          <div
            className={`transition-all duration-200 select-text ${
              isUser
                ? "px-5 py-3 rounded-[22px] rounded-tr-sm text-[13.5px] leading-relaxed bg-gradient-to-br from-accent-indigo to-accent-purple text-white shadow-md border-0"
                : "text-txt-primary text-[13.5px] leading-relaxed"
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap font-normal">{message.content}</p>
            ) : (
              <div className="prose dark:prose-invert text-txt-primary max-w-none text-[13.5px] leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");

                      if (match) {
                        return <CodeBlock code={codeString} language={match[1]} />;
                      }

                      return (
                        <code className="px-1.5 py-0.5 bg-bg-card border border-border-custom rounded-md font-mono text-xs text-accent-custom" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>

                {/* Streaming Pulse Cursor */}
                {isStreaming && (
                  <span className="inline-flex h-3.5 w-1.5 bg-accent-custom ml-1 animate-pulse" />
                )}
              </div>
            )}
          </div>

          {/* Minimal Actions Pane (AI only) */}
          {!isUser && !isStreaming && (
            <div className="flex items-center space-x-2 mt-2 text-txt-secondary">
              <button
                onClick={handleCopy}
                className="p-1 hover:text-txt-primary rounded transition-colors duration-150"
                title="Copy answer"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              </button>

              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 hover:text-txt-primary rounded transition-colors duration-150"
                  title="Regenerate answer"
                >
                  <RefreshCw size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
