"use client";

import { FormEvent, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { trackBehavior } from "@/lib/behavior";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type ChatResponse = {
  reply?: string;
};

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi, I am your QTPhone advisor. Ask me about camera picks, pricing, discounts, warranty, shipping, favorites, or cart options."
  }
];

const suggestedQuestions = ["Best camera pick", "Compare two phones", "Show best discount"];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage(input);
  }

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();

    if (!message) {
      return;
    }

    setInput("");
    setMessages((current) => [...current, { role: "user", content: message }]);
    setLoading(true);
    trackBehavior("chatbot_message", { message });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = (await response.json()) as ChatResponse;

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply ?? "I could not answer that yet."
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "Chat is temporarily unavailable. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function toggleOpen() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      trackBehavior("chatbot_open");
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      {open ? (
        <section className="w-[min(91vw,380px)] overflow-hidden rounded-2xl border border-accent/20 bg-elevated/95 shadow-cyanStrong backdrop-blur-xl sm:w-[min(92vw,400px)]">
          <div className="relative overflow-hidden border-b border-line px-4 py-4">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgb(var(--color-accent)/0.18),transparent_55%)]" />
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-white shadow-cyan">
                <Bot aria-hidden="true" size={18} />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-ink">QTPhone advisor</h2>
                <p className="text-xs font-medium text-muted">Premium product guidance</p>
              </div>
            </div>
            <button
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface/90 text-ink transition hover:border-accent hover:text-accent"
              type="button"
              aria-label="Close chatbot"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" size={17} />
            </button>
          </div>

          <div className="flex max-h-72 flex-col gap-3 overflow-y-auto bg-surface/35 px-4 py-4 sm:max-h-80">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-sm ${
                  message.role === "user"
                    ? "ml-auto rounded-br-md bg-accent text-white"
                    : "rounded-bl-md border border-line bg-elevated text-muted"
                }`}
              >
                {message.role === "assistant" ? (
                  <span className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-accent">
                    <Sparkles aria-hidden="true" size={12} />
                    Advisor
                  </span>
                ) : null}
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="w-fit rounded-2xl rounded-bl-md border border-line bg-elevated px-3.5 py-2.5 text-sm text-muted shadow-sm">
                Thinking...
              </div>
            ) : null}
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-line bg-elevated px-3 py-3">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                className="shrink-0 rounded-full border border-line bg-surface px-3 py-2 text-xs font-bold text-muted transition hover:border-accent hover:bg-accent/10 hover:text-ink"
                type="button"
                onClick={() => void sendMessage(question)}
              >
                {question}
              </button>
            ))}
          </div>

          <form className="flex gap-2 border-t border-line bg-elevated p-3" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="chatbot-message">
              Chat message
            </label>
            <input
              id="chatbot-message"
              className="min-h-12 flex-1 rounded-2xl border border-line bg-surface px-4 text-sm text-ink placeholder:text-muted/70 transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              value={input}
              placeholder="Ask QTPhone advisor..."
              onChange={(event) => setInput(event.target.value)}
            />
            <button
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-cyan transition hover:bg-accentStrong"
              type="submit"
              aria-label="Send chat message"
              disabled={loading}
            >
              <Send aria-hidden="true" size={17} />
            </button>
          </form>
        </section>
      ) : null}

      <button
        className="chatbot-pulse inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-soft transition hover:bg-accentStrong"
        type="button"
        aria-label={open ? "Close chatbot" : "Open chatbot"}
        title={open ? "Close chatbot" : "Open chatbot"}
        onClick={toggleOpen}
      >
        <MessageCircle aria-hidden="true" size={24} />
      </button>
    </div>
  );
}
