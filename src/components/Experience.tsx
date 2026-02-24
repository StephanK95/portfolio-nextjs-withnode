"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const jobs = [
  { img: "/assets/exp-intern.webp", title: "Frontend Engineer Intern", desc: "Assisted in the development of a web-based platform using React.js, enhancing interactivity." },
  { img: "/assets/exp-mobile.webp", title: "Mobile App Dev - JSM Tech", desc: "Designed and developed mobile app for both iOS & Android platforms using React Native." },
  { img: "/assets/exp-freelance.webp", title: "Freelance App Dev Project", desc: "Led the dev of a mobile app for a client, from initial concept to deployment on app stores." },
  { img: "/assets/exp-lead.webp", title: "Lead Frontend Developer", desc: "Developed and maintained user-facing features using modern frontend technologies." },
];

const cardVariants = {
  offscreen: { scale: 0.96, opacity: 0.9 },
  onscreen: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16">My work experience</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <motion.article
              key={job.title}
              className="experience-card-bg rounded-2xl p-6 flex gap-4 items-start"
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <Image src={job.img} alt="" width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl object-cover" />
              <div className="min-w-0">
                <h3 className="font-bold text-white">{job.title}</h3>
                <p className="mt-2 text-slate-400 text-sm leading-relaxed">{job.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
