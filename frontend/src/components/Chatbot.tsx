"use client";

import React, { useState, useEffect, useRef } from "react";
import { Message } from "../types";
import { sendChatbotMessage } from "../api";
import { MessageSquare, X, Send, Loader2, Bot, Sparkles } from "lucide-react";
import { showToast } from "./Toast";

interface ChatbotProps {
  onRefreshTelemetry: () => void;
  isDrawerOpen?: boolean;
}

function formatMessageTime(timestamp: Message["timestamp"]) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function Chatbot({ onRefreshTelemetry, isDrawerOpen }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "initial-msg",
      role: "assistant",
      content: "Xin chào! Tôi là **QTPhone Advisor** (AI powered by Groq).\n\nBạn có thể hỏi tôi chi tiết về thông số, giá bán các dòng điện thoại trong catalog, hoặc bất kỳ câu hỏi kiến thức ngoài lề nào khác!",
      timestamp: new Date(),
      mode: "AI",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isDrawerOpen) {
      setIsOpen(false);
    }
  }, [isDrawerOpen]);

  const trackTelemetryEvent = (type: string, label: string) => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, label }),
    }).catch(() => {});
  };

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || input;
    const text = rawText.trim();
    if (!text) return;

    if (!textToSend) setInput("");

    // Add user message to state
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      // Map message list including current message to history expected by server-side endpoint
      const history = nextMessages
        .filter((m) => m.id !== "initial-msg")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await sendChatbotMessage(text, history);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: res.reply,
        timestamp: new Date(),
        mode: res.mode || "AI",
      };

      setMessages((prev) => [...prev, botMsg]);
      showToast("Assistant responded.", "chat");
      onRefreshTelemetry();
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "I am experiencing difficulty connecting to the neural gateway. However, please note that our budget option is the **OPPO F19 ($280)** and our ultimate flagship is the **Samsung Universe 9 ($1249)**. Let me know if you would like details on any specific smartphone!",
        timestamp: new Date(),
        mode: "Demo",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggest = (text: string) => {
    trackTelemetryEvent("click", `Chatbot Suggestions: ${text}`);
    handleSend(text);
  };

  // Render markdown-like simple bold replacements
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Replace **text** with strong
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={idx} className="mt-1 first:mt-0 leading-relaxed text-xs">
          {parts.map((part, i) => (
            <span
              key={i}
              className={
                i % 2 === 1
                  ? "font-bold text-blue-600 dark:text-cyan-300 bg-blue-50 dark:bg-white/10 px-1.5 py-0.5 rounded shadow-2xs"
                  : ""
              }
            >
              {part}
            </span>
          ))}
        </p>
      );
    });
  };

  return (
    <div
      id="shopping-assistant-chatbot"
      className={`fixed bottom-6 right-6 z-30 flex flex-col items-end transition-all duration-300 ${
        isDrawerOpen ? "opacity-0 pointer-events-none translate-y-6 scale-90" : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            trackTelemetryEvent("click", "Chatbot: Open Chatbox Floating UI");
            onRefreshTelemetry();
          }}
          className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400 text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:shadow-cyan-500/60 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
          title="Open QTPhone Advisor"
        >
          {/* Animated glow ring indicator */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-slate-900"></span>
          </span>

          <MessageSquare className="w-6 h-6 text-white fill-white/20 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="bg-white dark:bg-[#1d2432] border border-slate-200 dark:border-slate-500/25 rounded-2xl w-[calc(100vw-32px)] sm:w-[360px] max-w-[360px] h-[480px] max-h-[calc(100vh-90px)] flex flex-col justify-between shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 text-slate-900 dark:text-zinc-100">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-[#131822] dark:via-[#1c2333] dark:to-[#131822] border-b border-indigo-500/20 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-display font-bold text-white tracking-wide">QTPhone Advisor</h4>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/30 text-[8px] font-mono font-bold text-cyan-300 uppercase leading-none">NEURAL</span>
                </div>
                <p className="text-[9px] text-zinc-400 font-mono tracking-wider mt-0.5">SMART ADVANCED ASSISTANT</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages List Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-slate-50/50 dark:bg-[#171b26]">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className="flex items-end gap-2 max-w-[88%]">
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shrink-0 mb-1 shadow-xs">
                      <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-3 h-3 text-cyan-300 fill-cyan-300/20" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-tr-none shadow-sm"
                        : "bg-white dark:bg-[#202838] border border-slate-200 dark:border-slate-500/20 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-xs"
                    }`}
                  >
                    {renderMessageContent(m.content)}
                  </div>
                </div>

                {/* Sub message details (timestamp / agent mode) */}
                <div className="flex items-center gap-1.5 mt-1 px-1 text-[9px] text-slate-400 dark:text-zinc-600 font-mono">
                  <span>{formatMessageTime(m.timestamp)}</span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-600 font-mono text-[10px] pl-1 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Assistant is drafting response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions chips */}
          {messages.length === 1 && !isLoading && (
            <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-[#151922] border-t border-slate-200 dark:border-white/5 flex flex-col gap-1.5 shrink-0 animate-in fade-in duration-300">
              <button
                type="button"
                onClick={() => handleSuggest("📱 Máy nào chụp ảnh tốt nhất?")}
                className="w-full px-3 py-1.5 bg-white dark:bg-white/5 hover:bg-blue-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-slate-950 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] font-medium text-slate-700 dark:text-zinc-200 transition text-left flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>📱 Máy nào chụp ảnh tốt nhất?</span>
              </button>
              <button
                type="button"
                onClick={() => handleSuggest("⚡ So sánh QTPhone 16 Ultra vs iPhone?")}
                className="w-full px-3 py-1.5 bg-white dark:bg-white/5 hover:bg-blue-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-slate-950 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] font-medium text-slate-700 dark:text-zinc-200 transition text-left flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>⚡ So sánh QTPhone 16 Ultra vs iPhone?</span>
              </button>
              <button
                type="button"
                onClick={() => handleSuggest("🤖 Bạn trả lời được kiến thức ngoài không?")}
                className="w-full px-3 py-1.5 bg-white dark:bg-white/5 hover:bg-blue-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-slate-950 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] font-medium text-slate-700 dark:text-zinc-200 transition text-left flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>🤖 Bạn trả lời được kiến thức ngoài không?</span>
              </button>
            </div>
          )}

          {/* Message Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-white/[0.01] border-t border-slate-200 dark:border-white/10 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask about specs, comparisons, or stocks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-transparent focus:outline-none border border-slate-300 dark:border-white/10 focus:border-blue-600 dark:focus:border-white rounded-full py-2 px-4 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 dark:bg-sky-500 hover:bg-blue-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 p-2.5 rounded-full transition disabled:opacity-40 shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
