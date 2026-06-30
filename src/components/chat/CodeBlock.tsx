"use client";

import React, { useState } from "react";
import { Copy, Check, Download, Maximize2, Minimize2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // toggles collapsible state if tall

  const lines = code.trim().split("\n");
  const isTall = lines.length > 15;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code-snippet.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (lang: string) => {
    const extMap: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      tsx: "tsx",
      jsx: "jsx",
      html: "html",
      css: "css",
      python: "py",
      rust: "rs",
      go: "go",
      json: "json",
      bash: "sh",
    };
    return extMap[lang.toLowerCase()] || "txt";
  };

  return (
    <>
      <div
        className={`w-full border border-border-custom bg-bg-card rounded-xl my-4 overflow-hidden flex flex-col transition duration-300 relative ${
          isFullscreen
            ? "fixed inset-4 z-50 bg-[#0d0d11] max-w-none shadow-2xl border-accent-indigo"
            : "shadow-xs"
        }`}
      >
        {/* Code Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-bg-app border-b border-border-custom/50 text-[10px] font-semibold text-txt-secondary">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-indigo" />
            <span className="uppercase text-accent-indigo">{language || "text"}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-1 hover:bg-border-custom hover:text-txt-primary rounded-md transition"
              title="Download file"
            >
              <Download size={12} />
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-border-custom hover:text-txt-primary rounded-md transition flex items-center gap-1"
              title="Copy snippet"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied</span>
                </>
              ) : (
                <Copy size={12} />
              )}
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:bg-border-custom hover:text-txt-primary rounded-md transition"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
          </div>
        </div>

        {/* Code Body */}
        <div
          className={`flex overflow-x-auto text-[11px] font-mono leading-relaxed p-4 bg-[#0d0d11] text-[#ededed] ${
            isTall && !isExpanded && !isFullscreen ? "max-h-[220px]" : "max-h-[600px]"
          }`}
        >
          {/* Line Numbers */}
          <div className="pr-3 border-r border-[#27272a] text-[#71717a] text-right select-none shrink-0 min-w-[20px]">
            {lines.map((_, idx) => (
              <div key={idx}>{idx + 1}</div>
            ))}
          </div>

          {/* Code Text */}
          <pre className="pl-4 pr-2 flex-1">
            <code>{code}</code>
          </pre>
        </div>

        {/* Tall Code Expand / Collapse Indicator */}
        {isTall && !isFullscreen && (
          <div className="border-t border-[#27272a] bg-[#0d0d11] p-1 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 py-1 px-3 hover:bg-[#1a1a24] text-[10px] text-[#a1a1aa] hover:text-[#ededed] rounded-lg transition"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={12} />
                  <span>Collapse block</span>
                </>
              ) : (
                <>
                  <ChevronDown size={12} />
                  <span>Expand block ({lines.length} lines)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Screen Backdrop for Fullscreen */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </>
  );
}
