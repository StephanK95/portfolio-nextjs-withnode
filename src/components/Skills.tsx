"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const skills = [
  {
    key: "n8n",
    eyebrow: "Automation",
    title: "n8n Workflows & Integration Engineering",
    image: "/assets/skill-n8n-abstract.svg",
    coverImage: "/assets/skill-n8n-cover.webp",
    description:
      "I design production-ready n8n automations that trigger reliably, branch intelligently, and fail safely.",
    bullets: [
      "Webhook + scheduled triggers with clean credential separation",
      "Robust branching, retries, batching, and error workflows",
      "API integrations with rate-limit aware patterns and validation",
      "Data transformation pipelines for clean CRM/DB payloads",
      "Observability: meaningful logs, traceability, and operational readiness",
      "Secure automation: secrets handling and protected endpoints",
    ],
  },
  {
    key: "azure",
    eyebrow: "Cloud & Infrastructure",
    title: "Azure Architecture, Kubernetes & Infrastructure",
    image: "/assets/skill-azure-abstract.svg",
    coverImage: "/assets/skill-azure-cover.webp",
    description:
      "From architecture to deployment: I build scalable Azure solutions that stay reliable under load.",
    bullets: [
      "Azure architecture mindset (security boundaries, scalability, maintainability)",
      "AKS foundations: Deployments, Services, Ingress, and autoscaling concepts",
      "Infrastructure planning: networking strategy, private connectivity patterns",
      "Identity & security: Entra ID, least-privilege access, secret management",
      "IaC alignment: CI/CD workflows and environment-based deployments",
      "Monitoring readiness: logs/metrics thinking with actionable alerting",
    ],
  },
  {
    key: "backend",
    eyebrow: "Backend",
    title: "Java & Spring Boot Services",
    image: "/assets/skill-backend-abstract.svg",
    coverImage: "/assets/skill-backend-cover.webp",
    description:
      "Clean backend services with strong security, predictable behavior, and maintainable design.",
    bullets: [
      "Spring Boot REST APIs with layered architecture and validation",
      "Security fundamentals: authentication/authorization patterns",
      "Persistence approach with SQL/JPA-style data modeling and transactions",
      "Testing strategy: unit + integration tests for confidence",
      "Error handling and consistent response contracts",
      "Integration endpoints built for automation/webhook workflows",
    ],
  },
  {
    key: "frontend",
    eyebrow: "Frontend",
    title: "Next.js & React User Interfaces",
    image: "/assets/skill-frontend-abstract.svg",
    coverImage: "/assets/skill-frontend-cover.webp",
    description:
      "Responsive, accessible UI that feels premium—designed for performance and real users.",
    bullets: [
      "Next.js (App Router) + React component architecture",
      "TypeScript-first UI for safer refactors and reliable behavior",
      "Performance considerations: rendering strategy, image optimization, UX responsiveness",
      "Accessibility-minded markup (semantics, focus, keyboard navigation)",
      "Polished styling with Tailwind and motion-friendly components",
      "Clean UX patterns for forms, loading states, and error feedback",
    ],
  },
] as const;

export default function Skills() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = skills[activeIndex];

  const total = skills.length;

  return (
    <section id="skills" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">Skills</h2>
        <p className="text-center text-slate-400 max-w-2xl mx-auto mb-14">
          A focused toolset built for automation, cloud infrastructure, and clean product engineering.
        </p>

        <div className="grid gap-8">
          <motion.div
            className="card-glow rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.key}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                >
                  <div className="w-full aspect-[16/7] relative">
                    <img
                      src={active.coverImage}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-6 sm:p-8">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      {active.eyebrow}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      {active.title}
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
                      {active.description}
                    </p>

                    <ul className="mt-6 grid gap-3 text-sm">
                      {active.bullets.map((b) => (
                        <li
                          key={b}
                          className="text-slate-300 leading-relaxed list-disc ml-5"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
          </motion.div>

          {/* Controls (only below): click to switch skill */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {skills.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Select ${s.title}`}
                aria-current={i === activeIndex}
                className={`group rounded-2xl text-left transition overflow-hidden ${
                  i === activeIndex
                    ? "bg-purple-400/10 ring-1 ring-purple-400/30"
                    : "bg-white/0 hover:bg-white/5"
                }`}
              >
                <div className="w-full aspect-[16/9] relative">
                  <img
                    src={s.coverImage}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    {s.eyebrow}
                  </p>
                  <p className="text-sm font-semibold text-white mt-1 truncate">
                    {s.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

