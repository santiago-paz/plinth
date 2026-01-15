"use client";

import { Project } from "@/lib/types";
import { getStrapiMedia } from "@/lib/strapi/api";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ProjectHeroProps {
    project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuWidth, setMenuWidth] = useState(0);

    useEffect(() => {
        const updateMenuWidth = () => {
            const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            // max-w-md is usually 28rem
            const maxWidth = 28 * rootFontSize;
            // The menu is w-full but capped at max-w-md
            setMenuWidth(Math.min(window.innerWidth, maxWidth));
        };

        updateMenuWidth();
        window.addEventListener('resize', updateMenuWidth);
        return () => window.removeEventListener('resize', updateMenuWidth);
    }, []);

    // Helper to get images with fallbacks
    const inspirationImage = getStrapiMedia(project.inspiration?.cover?.url || project.inspiration?.gallery?.[0]?.url);
    const areasImage = getStrapiMedia(project.areas?.cover?.url || project.areas?.list?.[0]?.photos?.[0]?.url);
    const infoImage = getStrapiMedia(project.plans?.cover?.url || project.plans?.list?.[0]?.picture?.url);
    const heroVideoUrl = getStrapiMedia(project.heroVideo?.url);

    const stagger = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="relative h-full w-full bg-zinc-950 overflow-hidden">
            {/* Full Screen Hero Video */}
            <div className="absolute inset-0 h-full w-full">
                {heroVideoUrl ? (
                    <video
                        src={heroVideoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                        <span className="text-zinc-500">No hay video disponible</span>
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full w-full p-4 md:p-6 pointer-events-none">
                {/* Bottom Left Text */}
                <div className="absolute bottom-12 left-8 lg:bottom-8 lg:left-12 pointer-events-auto" style={{ opacity: 0.8 }}>
                    <AnimatedText
                        text={project.title || ''}
                        className="text-5xl text-accent font-medium uppercase tracking-wide lg:text-7xl drop-shadow-2xl"
                        delay={0.5}
                    />
                    <AnimatedText
                        text={project.authorName || ''}
                        className="mb-2 text-2xl font-medium tracking-widest text-accent uppercase"
                        delay={0.4}
                    />
                </div>
            </div>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                animate={{ x: isMenuOpen ? -menuWidth : 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute top-1/2 -translate-y-1/2 right-0 z-[60] w-8 h-12 2xl:w-8 2xl:h-16 bg-zinc-950/30 rounded-l-lg border-y border-l border-white/10 flex items-center justify-center hover:bg-zinc-900/50 transition-colors focus:outline-none pointer-events-auto border-r-0"
            >
                {isMenuOpen ? (
                    <ChevronRight strokeWidth={1} className="text-white w-6 h-6 2xl:w-10 2xl:h-10" />
                ) : (
                    <ChevronLeft strokeWidth={1} className="text-white w-6 h-6 2xl:w-10 2xl:h-10" />
                )}
            </motion.button>

            {/* Floating Navigation Cards */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-[6px] cursor-pointer"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="absolute right-0 top-0 z-50 h-full w-full max-w-md bg-zinc-950/30 p-6"
                        >
                            {/* Custom Left Border with Gap for Button */}
                            <div className="absolute left-0 top-0 w-px bg-white/10 h-[calc(50%-1.5rem)] 2xl:h-[calc(50%-2rem)]" />
                            <div className="absolute left-0 bottom-0 w-px bg-white/10 h-[calc(50%-1.5rem)] 2xl:h-[calc(50%-2rem)]" />

                            <div className="flex h-full flex-col">
                                <motion.div
                                    className="flex flex-1 flex-col gap-4 overflow-y-auto"
                                    variants={stagger}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <NavigationCard
                                        href={`/projects/${project.slug}/inspiration`}
                                        label="Inspiration"
                                        image={inspirationImage || undefined}
                                    />
                                    <NavigationCard
                                        href={`/projects/${project.slug}/areas`}
                                        label="Areas"
                                        image={areasImage || undefined}
                                    />
                                    <NavigationCard
                                        href={`/projects/${project.slug}/plans`}
                                        label="+ Info"
                                        image={infoImage || undefined}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function NavigationCard({
    href,
    image,
    label
}: {
    href: string;
    image?: string;
    label: string;
}) {
    const router = useRouter();
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <div 
            onClick={() => router.push(href)} 
            className="group relative flex-1 overflow-hidden rounded-2xl bg-transparent cursor-pointer"
            role="button"
            tabIndex={0}
        >
            <motion.div variants={fadeInUp} className="h-full w-full relative">
                {/* Image Container with Mask for Bottom-Right Cutout */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    {image && (
                        <div
                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{
                                backgroundImage: `url(${image})`,
                            }}
                        />
                    )}
                </div>

                {/* Button Area - Positioned in the Cutout */}
                <div className="bg-black/50 backdrop-blur-md absolute bottom-0 right-0 flex items-center justify-end gap-3 rounded-tl-2xl px-4 pt-2 pb-[3px]">
                    <span className="text-sm font-didot font-medium tracking-widest uppercase text-zinc-200 group-hover:text-white transition-colors flex items-center h-full" style={{ fontFamily: "var(--font-didot)" }}>
                        {label}
                    </span>
                    {/* <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-transparent transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-transparent text-white">
                        <ArrowRight className="h-4 w-4" />
                    </div> */}
                </div>
            </motion.div>
        </div>
    );
}

function AnimatedText({
    text,
    className,
    delay = 0
}: {
    text: string;
    className?: string;
    delay?: number;
}) {
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: delay }
        }
    };

    const child = {
        hidden: {
            opacity: 0,
            filter: "blur(0.625rem)",
            scale: 1.5,
        },
        visible: {
            opacity: 1,
            filter: "blur(0)",
            scale: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            }
        }
    };

    return (
        <motion.div
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {text.split("").map((letter, index) => (
                <motion.span
                    key={index}
                    variants={child as Variants}
                    style={{ display: "inline-block", fontFamily: "var(--font-didot)" }}
                >
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.div>
    );
}
