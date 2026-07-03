"use client";

import React, { useState } from "react";
import { Mail, CheckCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { subscribeNewsletter } from "../api";
import { showToast } from "./Toast";

interface NewsletterProps {
  onRefreshTelemetry: () => void;
}

export default function Newsletter({ onRefreshTelemetry }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await subscribeNewsletter(cleanEmail);
      setIsSubscribed(true);
      showToast(`Subscribed successfully: ${cleanEmail}`, "newsletter");
      onRefreshTelemetry();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during subscription.";
      setError(message);
      showToast("Newsletter subscription error.", "info");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="newsletter-signup" className="story-panel bg-[#f8fafc] dark:bg-[#171b26] py-20 px-6 md:px-12 border-b border-slate-200 dark:border-white/10 scroll-mt-20 relative overflow-hidden transition-colors duration-300" data-reveal>
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-white/[0.01] blur-[90px] pointer-events-none select-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10" data-reveal>
        {/* Small Icon Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-slate-200/70 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-zinc-400 mb-6">
          <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>STAY UPDATED</span>
        </div>

        <h2 className="font-display font-light text-3xl md:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight">
          Get launch updates, <br />
          <span className="font-serif italic text-slate-500 dark:text-zinc-400">price drops, and availability alerts.</span>
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-sans font-light">
          Subscribe to our exclusive newsletter to receive early access notification, special trade-in bonuses, and VIP preorder invitations directly to your inbox.
        </p>

        {isSubscribed ? (
          /* Success Curation Box */
          <div className="micro-lift mt-8 p-6 rounded-2xl bg-white dark:bg-[#202838] border border-slate-200 dark:border-slate-500/25 max-w-lg mx-auto text-left animate-in fade-in zoom-in-95 duration-300 shadow-sm dark:shadow-none">
            <div className="flex gap-3 items-start text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">You&apos;re on the QTPhone launch list.</h4>
                <p className="text-slate-600 dark:text-zinc-400 text-xs mt-1">
                  We&apos;ll send priority availability, trade-in offers, and launch pricing to {email}.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Subscription Form */
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col gap-2.5">
            <div className="relative flex items-center bg-white dark:bg-[#202838] hover:bg-slate-50 dark:hover:bg-[#253145] border border-slate-300 dark:border-slate-500/25 focus-within:border-blue-600 dark:focus-within:border-sky-400 rounded-full overflow-hidden p-1 transition duration-200 shadow-sm dark:shadow-none focus-within:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-transparent focus:outline-none py-2.5 px-4 text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="interactive-press bg-blue-600 hover:bg-blue-500 text-white font-display font-medium text-xs px-6 py-2.5 rounded-full transition flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-600/20"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="text-left text-xs font-semibold text-rose-500 dark:text-rose-400 pl-1 mt-1 font-mono">
                &times; {error}
              </p>
            )}

            <div className="flex justify-center items-center gap-1.5 mt-4 text-[10px] text-slate-500 dark:text-zinc-500 select-none">
              <Sparkles className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
              <span>Priority launch alerts and availability updates.</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
