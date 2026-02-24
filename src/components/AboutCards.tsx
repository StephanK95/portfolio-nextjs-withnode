"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* Framer: whileInView replaces CSS scroll-animate + IntersectionObserver */
const cardVariants = {
  offscreen: { scale: 0.96, opacity: 0.9 },
  onscreen: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const techTags = ["ReactJS", "VueJS", "Next.JS", "Express", "TypeScript", "GraphQL"];

export default function AboutCards() {
  return (
    <section id="about" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          className="card-glow rounded-2xl p-6 md:col-span-2 lg:col-span-1"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, margin: "-40px" }}
        >
          <Image src="/assets/card-collaboration.webp" alt="Collaboration" width={400} height={144} className="w-full h-36 object-cover rounded-xl mb-4" />
          <p className="text-white font-medium leading-relaxed">I prioritize client collaboration, fostering open communication</p>
        </motion.div>

        <motion.div
          className="card-glow rounded-2xl p-6"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, margin: "-40px" }}
        >
          <Image src="/assets/card-timezones.webp" alt="Time zones" width={400} height={144} className="w-full h-36 object-cover rounded-xl mb-4" />
          <p className="text-white font-medium leading-relaxed">I&apos;m very flexible with time zone communications</p>
        </motion.div>

        <motion.div
          className="card-glow rounded-2xl p-6"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, margin: "-40px" }}
        >
          <Image src="/assets/card-techstack.webp" alt="Tech stack" width={400} height={112} className="w-full h-28 object-cover rounded-xl mb-4" />
          <p className="text-slate-400 text-sm mb-3">I constantly try to improve</p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">My tech stack</p>
          <div className="flex flex-wrap gap-2">
            {techTags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-lg border border-slate-500/50 text-slate-300 text-sm">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="card-glow rounded-2xl p-6 flex items-center gap-4"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, margin: "-40px" }}
        >
          <Image src="/assets/card-enthusiast.webp" alt="Tech enthusiast" width={96} height={96} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
          <p className="text-white font-medium">Tech enthusiast with a passion for development.</p>
        </motion.div>

        <motion.div
          className="card-glow rounded-2xl p-6 md:col-span-2 grid md:grid-cols-2 gap-6 items-center"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, margin: "-40px" }}
        >
          <div>
            <Image src="/assets/card-animation.webp" alt="JS Animation library" width={400} height={160} className="w-full h-40 object-cover rounded-xl mb-4" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">The Inside Scoop</p>
            <h2 className="text-xl font-bold text-white mt-1">Currently building a JS Animation library</h2>
          </div>
          <div className="code-block rounded-xl p-4 overflow-x-auto">
            <pre className="text-slate-400"><code><span className="text-purple-400">import</span> &#123; motion &#125; <span className="text-purple-400">from</span> <span className="text-amber-300">&apos;framer-motion&apos;</span>;
<span className="text-purple-400">import</span> &#123; useAnimation &#125; <span className="text-purple-400">from</span> <span className="text-amber-300">&apos;framer-motion&apos;</span>;

<span className="text-slate-500">// Custom spring animations</span>
<span className="text-blue-400">const</span> spring = &#123; type: <span className="text-amber-300">&apos;spring&apos;</span>, stiffness: <span className="text-emerald-400">300</span> &#125;;</code></pre>
          </div>
        </motion.div>

        <motion.div
          className="card-glow rounded-2xl p-6 md:col-span-2 lg:col-span-1 flex flex-col justify-center"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, margin: "-40px" }}
        >
          <p className="text-white font-medium mb-4">Do you want to start a project together?</p>
          <CopyEmailButton />
        </motion.div>
      </div>
    </section>
  );
}

function CopyEmailButton() {
  const email = "hello@example.com";
  return (
    <motion.button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(email);
        // Could use Framer key/AnimatePresence for "Copied!" feedback
      }}
      className="group btn-ghost w-fit px-5 py-2.5 rounded-lg font-medium border border-slate-400/50 text-white inline-flex items-center gap-2"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <motion.span
        className="inline-block"
        initial={false}
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
      </motion.span>
      Copy my email address
    </motion.button>
  );
}
