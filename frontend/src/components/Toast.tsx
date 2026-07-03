"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Activity, Heart, ShoppingBag, MessageSquare, Bell } from "lucide-react";

export type ToastType = "info" | "telemetry" | "favorite" | "cart" | "chat" | "newsletter";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

type ToastListener = (message: string, type: ToastType) => void;
const listeners: ToastListener[] = [];

export function showToast(message: string, type: ToastType = "info") {
  listeners.forEach((l) => l(message, type));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (message: string, type: ToastType) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[#0a0a0a]/95 border border-white/10 text-zinc-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200 text-xs"
        >
          {t.type === "favorite" && <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />}
          {t.type === "cart" && <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />}
          {t.type === "telemetry" && <Activity className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />}
          {t.type === "chat" && <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />}
          {t.type === "newsletter" && <Bell className="w-4 h-4 text-purple-400 shrink-0" />}
          {t.type === "info" && <Sparkles className="w-4 h-4 text-zinc-400 shrink-0" />}
          <span className="font-medium leading-relaxed">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
