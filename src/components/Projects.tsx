"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const projects = [
  {
    id: "solar",
    img: "/assets/card-solar-system.webp",
    alt: "3D Solar System",
    title: "3D Solar System Planets to Explore",
    description: "Explore the wonders of our solar system with this captivating 3D simulation of the planets using Three.js.",
    tags: ["⚡", "▶", "M"],
  },
  {
    id: "yoom",
    img: "/assets/card-yoom.webp",
    alt: "Yoom Video Conferencing",
    title: "Yoom - Video Conferencing App",
    description: "Simplify your video conferencing experience with Yoom. Seamlessly connect with colleagues and friends.",
    tags: ["📶", "⚡", "C"],
  },
  {
    id: "ai-saas",
    img: "/assets/card-ai-saas.webp",
    alt: "AI Image SaaS",
    title: "AI Image SaaS - Canva Application",
    description: "A REAL Software-as-a-Service app with AI features and a payments and credits system using the latest tech stack.",
    tags: ["⚡", "▶"],
  },
  {
    id: "iphone",
    img: "/assets/card-iphone.webp",
    alt: "Animated iPhone 3D",
    title: "Animated Apple iPhone 3D Website",
    description: "Recreated the Apple iPhone 15 Pro website, combining GSAP animations and Three.js 3D effects.",
    tags: ["⚡", "M"],
  },
];

const cardVariants = {
  offscreen: { opacity: 0, y: 24 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
      <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16">
        A small selection of recent projects
      </h2>
      <div className="grid sm:grid-cols-2 gap-8">
        {projects.map((project) => (
          <motion.article
            key={project.id}
            className="card-glow rounded-2xl overflow-hidden"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <Image
              src={project.img}
              alt={project.alt}
              width={600}
              height={340}
              className="w-full aspect-video object-cover border-b border-white/5"
            />
            <div className="p-6">
              <h3 className="font-bold text-lg text-white">{project.title}</h3>
              <p className="mt-2 text-slate-400 text-sm leading-relaxed">{project.description}</p>
              <div className="flex gap-2 mt-4 text-slate-500">
                {project.tags.map((t) => (
                  <span key={t} className="w-8 h-8 rounded bg-slate-700/50 flex items-center justify-center text-xs">
                    {t}
                  </span>
                ))}
              </div>
              <Link href="#" className="group mt-4 inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg font-medium border border-slate-400/50 text-white hover:bg-white/5">
                Check Live Site
                <motion.span
                  className="inline-block"
                  initial={false}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7h-10v10"/></svg>
                </motion.span>
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
