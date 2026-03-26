"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const cardVariants = {
  offscreen: { scale: 0.96, opacity: 0.9 },
  onscreen: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const phases = [
  {
    key: "phase-1",
    eyebrow: "Phase 1",
    title: "Discovery & Direction",
    icon: "/assets/approach-phase-discovery.svg",
    kicker: "Clarity before code.",
    summary:
      "We align on goals, audience, and success metrics—then turn that into a concrete plan we both feel confident about.",
    points: [
      "Quick discovery call + requirements mapping",
      "Scope, priorities, and feature checklist",
      "UX flow + page structure outline",
      "Technical plan (stack, integrations, milestones)",
    ],
    deliverables: ["Project brief", "Implementation plan", "Milestone timeline"],
  },
  {
    key: "phase-2",
    eyebrow: "Phase 2",
    title: "Build With Momentum",
    icon: "/assets/approach-phase-build.svg",
    kicker: "Ship incrementally.",
    summary:
      "I develop in focused iterations. You get progress you can review early, and we adjust as reality meets the plan.",
    points: [
      "Design polish + responsive UI implementation",
      "Component-driven development (reusable building blocks)",
      "n8n/webhook integrations where needed",
      "Frequent updates and review checkpoints",
    ],
    deliverables: ["Working features", "Live previews", "Iterative feedback loop"],
  },
  {
    key: "phase-3",
    eyebrow: "Phase 3",
    title: "Polish, Launch & Iterate",
    icon: "/assets/approach-phase-polish.svg",
    kicker: "Quality you can feel.",
    summary:
      "We focus on the last 10%: performance, edge cases, and a clean final experience—then we keep improving after launch.",
    points: [
      "Final UI refinement + accessibility pass",
      "Performance & reliability checks",
      "Deployment + go-live support",
      "Post-launch improvements and ongoing optimization",
    ],
    deliverables: ["Production-ready release", "Launch support", "Roadmap for iteration"],
  },
] as const;

export default function Approach() {
  const [activePhaseKey, setActivePhaseKey] = useState<(typeof phases)[number]["key"] | null>(null);

  const activePhase = phases.find((p) => p.key === activePhaseKey) ?? null;

  useEffect(() => {
    if (!activePhaseKey) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActivePhaseKey(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePhaseKey]);

  return (
    <section className="section-approach-bg relative py-24 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16">My approach</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {phases.map((phase, idx) => (
            <motion.button
              key={phase.key}
              type="button"
              className="approach-card-bg rounded-2xl p-8 flex flex-col items-start text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/30"
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: idx * 0.01 }}
              onClick={() => setActivePhaseKey(phase.key)}
              aria-haspopup="dialog"
              aria-expanded={activePhaseKey === phase.key}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  <Image
                    src={phase.icon}
                    alt=""
                    width={44}
                    height={44}
                    className="w-10 h-10"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  {phase.eyebrow}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-3">{phase.title}</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{phase.kicker}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/80">
                Learn more
                <motion.span
                  initial={false}
                  className="inline-flex"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  aria-hidden
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Smoothly fade the dotted/grid background into the next section */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none -z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(10, 9, 26, 0) 0%, rgba(10, 9, 26, 1) 85%)",
        }}
      />

      <AnimatePresence>
        {activePhase ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Details for ${activePhase.title}`}
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setActivePhaseKey(null)}
              aria-hidden
            />

            {/* Panel */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <div className="card-glow rounded-2xl p-6 sm:p-8 border border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      {activePhase.eyebrow}
                    </div>
                    <div className="mt-3 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      <Image src={activePhase.icon} alt="" width={64} height={64} className="w-14 h-14" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-2">{activePhase.title}</h3>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">{activePhase.summary}</p>
                  </div>

                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/30"
                    onClick={() => setActivePhaseKey(null)}
                    aria-label="Close dialog"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/90">What happens in this phase</h4>
                    <ul className="mt-3 grid gap-2">
                      {activePhase.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="mt-0.5 inline-flex w-5 h-5 rounded-lg bg-purple-500/10 border border-purple-400/20 items-center justify-center text-purple-300">
                            ✓
                          </span>
                          <span className="pt-0.5">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white/90">You receive</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activePhase.deliverables.map((d) => (
                        <span key={d} className="px-3 py-1.5 rounded-lg border border-slate-500/50 text-slate-200 text-sm bg-white/5">
                          {d}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Want this done for your project? Send a message in the contact section and we&apos;ll pick the best starting point.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
