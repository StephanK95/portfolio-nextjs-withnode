'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/* Framer Motion: initial + animate for entrance, whileHover/whileTap for button */
const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const spring = { type: 'spring' as const, stiffness: 300, damping: 24 };

/* Drift-Animation für die Wellen-Linien (Framer Motion statt Keyframes) */
const bgDriftTransition = {
    duration: 18,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: [0.42, 0, 0.58, 1] as const, // easeInOut cubic bezier
};

export default function Hero() {
    return (
        <section
            id="hero"
            className="hero-bg hero-speckles min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        >
            <motion.div
                className="hero-bg-image absolute inset-0 z-0"
                aria-hidden
                animate={{
                    backgroundPosition: [
                        '45% 48%',
                        '62% 56%',
                        '48% 44%',
                        '45% 48%',
                    ],
                }}
                transition={bgDriftTransition}
            />
            {/* Weicher Übergang zur nächsten Section – langer Gradient per Framer Motion */}
            <motion.div
                className="absolute inset-x-0 bottom-0 z-[1] pointer-events-none"
                style={{
                    height: '85%',
                    background: `linear-gradient(to bottom, 
            transparent 0%, 
            rgba(10, 9, 26, 0.08) 20%, 
            rgba(10, 9, 26, 0.22) 40%, 
            rgba(10, 9, 26, 0.45) 60%, 
            rgba(10, 9, 26, 0.72) 78%, 
            #0a091a 100%)`,
                }}
                initial={false}
            />
            <motion.div
                className="relative z-10 flex flex-col items-center text-center max-w-4xl pt-16 sm:pt-20"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                <motion.p
                    className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-[0.2em] mb-4"
                    variants={item}
                >
                    Dynamic Web Magic with Next.js
                </motion.p>
                <motion.h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                    variants={item}
                >
                    <span className="text-white block">
                        Transforming Concepts into Seamless
                    </span>
                    <span className="hero-purple-text block mt-1">
                        User Experiences
                    </span>
                </motion.h1>
                <motion.p
                    className="mt-6 text-base sm:text-lg text-slate-400"
                    variants={item}
                >
                    Hi! I&apos;m John Doe, a Next.js Developer based in The USA
                </motion.p>
                <motion.div variants={item} className="mt-10">
                    <Link
                        href="#projects"
                        className="group hero-cta-btn px-6 py-3 rounded-xl font-medium text-white inline-flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                        <motion.span
                            className="inline-flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={spring}
                        >
                            See my work
                            <motion.span
                                className="inline-block"
                                initial={false}
                                whileHover={{ x: 4 }}
                                transition={spring}
                            >
                                →
                            </motion.span>
                        </motion.span>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
