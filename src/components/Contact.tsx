"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 max-w-3xl mx-auto border-t border-white/5">
      <h2 className="text-2xl font-bold text-white">Ready to take your digital presence to the next level?</h2>
      <p className="mt-4 text-slate-400">Reach out to me today and let&apos;s discuss how I can help you achieve your goals.</p>
      <Link href="mailto:hello@example.com" className="group inline-block mt-8">
        <motion.span
          className="btn-primary w-fit px-5 py-2.5 rounded-lg font-medium border border-slate-400/50 text-white inline-flex items-center gap-2 hover:bg-slate-700/50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          Get in touch
          <motion.span
            initial={false}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7h-10v10"/></svg>
          </motion.span>
        </motion.span>
      </Link>
    </section>
  );
}
