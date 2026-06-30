"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trackBehavior } from "@/lib/behavior";

const newsletterSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  updates: z.boolean()
});

type NewsletterValues = z.infer<typeof newsletterSchema>;
type SubmitState = "idle" | "success" | "error";

export function NewsletterSection() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("No spam, only launch updates and price drops.");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      updates: true
    }
  });

  async function onSubmit(values: NewsletterValues) {
    const normalizedEmail = values.email.trim().toLowerCase();
    setSubmitState("idle");
    setMessage("Sending your subscription...");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: normalizedEmail,
          source: "smartphone-landing-page",
          updates: values.updates
        })
      });

      if (!response.ok) {
        throw new Error("Newsletter API returned an error.");
      }

      trackBehavior("newsletter_submit", { emailDomain: normalizedEmail.split("@")[1] });
      reset({ email: "", updates: true });
      setSubmitState("success");
      setMessage("Thanks. You are on the smartphone update list.");
    } catch {
      setSubmitState("error");
      setMessage("We could not register that email. Try again in a moment.");
    }
  }

  const errorMessage = errors.email?.message;

  return (
    <section id="newsletter" className="border-t border-line bg-canvas py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-content gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="soft-reveal">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            VIP Updates
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Stay ahead with exclusive HeliPhone announcements.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted">
            Be the first to know about new flagship releases, software upgrades, exclusive online promotions, and VIP launch event invitations.
          </p>
        </div>

        <form
          className="premium-panel soft-reveal rounded-[1.75rem] p-5 sm:p-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <label className="text-sm font-semibold text-ink" htmlFor="newsletter-email">
            Email address
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                size={18}
              />
              <input
                id="newsletter-email"
                className="min-h-[3.25rem] w-full rounded-2xl border border-line bg-surface py-4 pl-12 pr-4 text-ink placeholder:text-muted/75 transition focus:border-accent"
                type="email"
                placeholder="you@example.com"
                aria-describedby="newsletter-message newsletter-email-error"
                aria-invalid={Boolean(errorMessage)}
                {...register("email")}
              />
            </div>
            <button
              className="premium-button inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              <Send aria-hidden="true" size={17} />
              {isSubmitting ? "Sending" : "Notify me"}
            </button>
          </div>
          <label className="mt-4 flex items-start gap-3 text-sm text-muted">
            <input
              className="mt-1 h-4 w-4 rounded border-line accent-[rgb(var(--color-accent))]"
              type="checkbox"
              {...register("updates")}
            />
            Send me launch updates and price drops.
          </label>
          {errorMessage ? (
            <p id="newsletter-email-error" className="mt-3 text-sm font-medium text-danger">
              {errorMessage}
            </p>
          ) : null}
          <p
            id="newsletter-message"
            className={`mt-4 flex min-h-6 items-center gap-2 text-sm ${
              submitState === "success"
                ? "text-success"
                : submitState === "error"
                  ? "text-danger"
                  : "text-muted"
            }`}
            aria-live="polite"
          >
            {submitState === "success" ? <CheckCircle2 aria-hidden="true" size={17} /> : null}
            {message}
          </p>
        </form>
      </div>
    </section>
  );
}
