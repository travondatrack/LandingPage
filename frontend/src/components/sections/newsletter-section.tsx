"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Mail, Send, Sparkles } from "lucide-react";
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
type NewsletterResponse = {
  ok: boolean;
  delivery?: "webhook" | "local";
  message?: string;
};

export function NewsletterSection() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("No spam. Unsubscribe anytime with one click.");
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
    setMessage("Subscribing you to VIP alerts...");

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

      const data = (await response.json()) as NewsletterResponse;
      trackBehavior("newsletter_submit", { emailDomain: normalizedEmail.split("@")[1] });
      reset({ email: "", updates: true });
      setSubmitState("success");
      setMessage(
        data.delivery === "webhook"
          ? "Success! Your validated email was sent to the live webhook."
          : "Success! Your email passed validation and was stored locally for this demo."
      );
    } catch {
      setSubmitState("error");
      setMessage("We could not register that email. Please try again in a moment.");
    }
  }

  const errorMessage = errors.email?.message;

  return (
    <section
      id="newsletter"
      className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(0,119,182,0.12),transparent)] bg-surface border-t border-line/80 py-20 sm:py-24"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="mx-auto max-w-content px-5">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-accent/30 bg-elevated/90 p-8 sm:p-12 lg:p-16 shadow-xl backdrop-blur">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="soft-reveal">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent shadow-2xs">
                <Sparkles size={14} />
                <span>Instant VIP Access</span>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-tight">
                Get launch updates, price drops, and availability alerts.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted">
                Join our exclusive insider list. Be first in line when flagship models drop, receive
                priority notification on restocks, and unlock member-only online discounts.
              </p>
            </div>

            <form
              className="rounded-3xl border border-line bg-surface/90 p-6 sm:p-8 shadow-md backdrop-blur relative z-10"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <label
                className="text-sm font-bold text-ink flex items-center gap-2"
                htmlFor="newsletter-email"
              >
                <Mail size={16} className="text-accent" />
                <span>Your Email Address</span>
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
                    className="min-h-[3.25rem] w-full rounded-2xl border border-line bg-canvas py-3.5 pl-12 pr-4 text-sm text-ink placeholder:text-muted/75 transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    type="email"
                    placeholder="name@example.com"
                    disabled={isSubmitting || submitState === "success"}
                    aria-describedby="newsletter-message newsletter-email-error"
                    aria-invalid={Boolean(errorMessage)}
                    {...register("email")}
                  />
                </div>
                <button
                  className={`inline-flex min-h-[3.25rem] shrink-0 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed ${
                    submitState === "success"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-accent hover:bg-accent/90"
                  }`}
                  type="submit"
                  disabled={isSubmitting || submitState === "success"}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={17} />
                      <span>Subscribing...</span>
                    </>
                  ) : submitState === "success" ? (
                    <>
                      <CheckCircle2 size={17} />
                      <span>Subscribed!</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Notify Me</span>
                    </>
                  )}
                </button>
              </div>

              <label className="mt-4 flex items-start gap-2.5 text-xs sm:text-sm text-muted cursor-pointer">
                <input
                  className="mt-0.5 h-4 w-4 rounded border-line accent-accent"
                  type="checkbox"
                  disabled={isSubmitting || submitState === "success"}
                  {...register("updates")}
                />
                <span>Send me exclusive price drops and limited promotional offers.</span>
              </label>

              {errorMessage ? (
                <p id="newsletter-email-error" className="mt-3 text-xs font-semibold text-danger">
                  {errorMessage}
                </p>
              ) : null}

              <p
                id="newsletter-message"
                className={`mt-3 flex min-h-6 items-center gap-2 text-xs font-medium ${
                  submitState === "success"
                    ? "text-emerald-400 font-bold"
                    : submitState === "error"
                      ? "text-danger"
                      : "text-muted"
                }`}
                aria-live="polite"
              >
                {submitState === "success" ? <CheckCircle2 aria-hidden="true" size={15} /> : null}
                {message}
              </p>

              {submitState === "success" && (
                <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-canvas/90 p-4 font-mono text-[11px] text-emerald-400 shadow-inner animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2 text-muted">
                    <span>WEBHOOK PAYLOAD INSPECTOR</span>
                    <span className="text-emerald-400 font-bold">POST /api/newsletter • 200 OK</span>
                  </div>
                  <pre className="overflow-x-auto text-ink">
{JSON.stringify(
  {
    event: "VIP_PREORDER_WEBHOOK",
    deliveryStatus: "DELIVERED",
    timestamp: new Date().toISOString(),
    channel: "QTPhone Flagship Webhook"
  },
  null,
  2
)}
                  </pre>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
