"use client";

import { FormEvent, useState } from "react";
import { Mail, Send } from "lucide-react";

type SubmitState = "idle" | "submitting" | "success" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      setSubmitState("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setSubmitState("submitting");
    setMessage("");

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_NEWSLETTER_WEBHOOK_URL;

      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: normalizedEmail,
            source: "smartphone-landing-page"
          })
        });

        if (!response.ok) {
          throw new Error("Newsletter webhook returned an error.");
        }
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 350));
      }

      setEmail("");
      setSubmitState("success");
      setMessage("Thanks. You are on the smartphone update list.");
    } catch {
      setSubmitState("error");
      setMessage("We could not register that email. Try again in a moment.");
    }
  }

  return (
    <section id="newsletter" className="border-t border-line bg-canvas py-16 sm:py-20">
      <div className="mx-auto grid max-w-content gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="soft-reveal">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Launch updates
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            Get notified when new smartphone picks arrive.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted">
            Receive product refreshes, deal notes, and availability changes without leaving the
            landing page.
          </p>
        </div>

        <form
          className="soft-reveal rounded-lg border border-line bg-elevated p-5 shadow-sm sm:p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <label className="text-sm font-semibold text-ink" htmlFor="newsletter-email">
            Email address
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={18}
              />
              <input
                id="newsletter-email"
                className="min-h-12 w-full rounded-md border border-line bg-surface py-3 pl-10 pr-3 text-ink placeholder:text-muted/75 transition focus:border-accent"
                type="email"
                value={email}
                placeholder="you@example.com"
                aria-describedby="newsletter-message"
                aria-invalid={submitState === "error"}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (submitState !== "submitting") {
                    setSubmitState("idle");
                    setMessage("");
                  }
                }}
              />
            </div>
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accentStrong disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={submitState === "submitting"}
            >
              <Send aria-hidden="true" size={17} />
              {submitState === "submitting" ? "Sending" : "Notify me"}
            </button>
          </div>
          <p
            id="newsletter-message"
            className={`mt-3 min-h-6 text-sm ${
              submitState === "success"
                ? "text-success"
                : submitState === "error"
                  ? "text-danger"
                  : "text-muted"
            }`}
            aria-live="polite"
          >
            {message || "No spam, only relevant product updates."}
          </p>
        </form>
      </div>
    </section>
  );
}
