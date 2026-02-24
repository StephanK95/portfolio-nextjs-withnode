"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <motion.section
      id="testimonials"
      className="py-24 px-6 max-w-3xl mx-auto border-t border-white/5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-white mb-8">Kind words from satisfied clients</h2>
      <blockquote>
        <p className="text-slate-300 leading-relaxed italic">
          Collaborating with John was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. John&apos;s enthusiasm for every facet of development truly stands out. If you&apos;re seeking to elevate your website and elevate your brand, John is the ideal partner.
        </p>
        <footer className="mt-6">
          <p className="font-semibold text-white">Michael Johnson</p>
          <p className="text-sm text-slate-500">Director of AlphaStream Technologies</p>
        </footer>
      </blockquote>
    </motion.section>
  );
}
