"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState<string>("");

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const errors = useMemo(() => {
    const next: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) next.name = "Please enter your name.";
    if (!email.trim()) next.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Please enter a valid email address.";
    if (!message.trim()) next.message = "Please write a short message.";

    return next;
  }, [email, message, name]);

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  const showNameError = touched.name && !!errors.name;
  const showEmailError = touched.email && !!errors.email;
  const showMessageError = touched.message && !!errors.message;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!canSubmit) return;

    setSubmitting(true);
    setStatus("idle");
    setServerError("");

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_CONTACT_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error("Missing NEXT_PUBLIC_N8N_CONTACT_WEBHOOK_URL");
      }

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          source: "portfolio-contact-form",
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Webhook request failed (${res.status})`);
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      setTouched({ name: false, email: false, message: false });
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24 px-6 max-w-3xl mx-auto border-t border-white/5">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Contact</h2>
        <p className="mt-4 text-slate-400">
          Tell me about your project and I&apos;ll get back to you.
        </p>
      </div>

      <div className="mt-10 card-glow rounded-2xl p-6 sm:p-8">
        <form onSubmit={onSubmit} className="grid gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/90">
                Your name
              </label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                placeholder="Jane Doe"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/20 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                aria-invalid={showNameError}
                aria-describedby={showNameError ? "name-error" : undefined}
                required
              />
              {showNameError ? (
                <p id="name-error" className="mt-2 text-xs text-rose-300">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="jane@company.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/20 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? "email-error" : undefined}
                required
              />
              {showEmailError ? (
                <p id="email-error" className="mt-2 text-xs text-rose-300">
                  {errors.email}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/90">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, message: true }))}
              placeholder="What are you building? What timeline are you aiming for?"
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-900/20 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
              aria-invalid={showMessageError}
              aria-describedby={showMessageError ? "message-error" : undefined}
              required
            />
            {showMessageError ? (
              <p id="message-error" className="mt-2 text-xs text-rose-300">
                {errors.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-slate-400">Your message will be sent securely.</p>

            <motion.button
              type="submit"
              className="btn-primary w-full sm:w-auto rounded-xl border border-white/10 px-6 py-3 font-medium text-white inline-flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-700/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ scale: canSubmit ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              disabled={!canSubmit}
            >
              {submitting ? "Sending..." : "Send message"}
              <motion.span
                initial={false}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7h-10v10" />
                </svg>
              </motion.span>
            </motion.button>
          </div>

          {status === "sent" ? (
            <p className="text-sm text-emerald-300">Thanks! Your message has been sent.</p>
          ) : null}
          {status === "error" ? (
            <p className="text-sm text-rose-300">
              Sorry — something went wrong sending your message. {serverError ? `(${serverError})` : null}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
