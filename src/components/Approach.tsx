"use client";

import { motion } from "framer-motion";

const cardVariants = {
  offscreen: { scale: 0.96, opacity: 0.9 },
  onscreen: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export default function Approach() {
  return (
    <section className="section-approach-bg relative py-24 px-6 border-t border-sky-500/20">
      <div className="max-w-5xl mx-auto relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16">My approach</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            className="approach-card-bg rounded-2xl p-8 flex flex-col items-center justify-center text-center"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="text-xl font-bold text-white">Phase 1</span>
          </motion.div>
          <motion.div
            className="approach-card-bg rounded-2xl p-8 flex flex-col"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Phase 2</span>
            <h3 className="text-lg font-bold text-white mb-4">Development & Progress Update</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Once we agree on the plan, I cue my lofi playlist and dive into coding. From initial sketches to polished code, I keep you updated every step of the way.
            </p>
          </motion.div>
          <motion.div
            className="approach-card-bg rounded-2xl p-8 flex flex-col items-center justify-center text-center"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="text-xl font-bold text-white">Phase 3</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
