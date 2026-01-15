"use client";

import { useState, useCallback, useEffect } from "react";
import { Project } from "@/lib/types";
import { getStrapiMedia } from "@/lib/strapi/api";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";

interface PlansClientProps {
    project: Project;
}

function ArrowPrev() {
    return (
        <div className="flex items-center -space-x-8 opacity-80 group-hover:opacity-100 transition-opacity">
            <ChevronLeft className="h-10 w-10 text-white stroke-[1]" />
            <ChevronLeft className="h-10 w-10 text-white/60 stroke-[1]" />
            <ChevronLeft className="h-10 w-10 text-white/30 stroke-[1]" />
        </div>
    )
}

function ArrowNext({ isLast }: { isLast?: boolean }) {
    if (isLast) {
        return (
            <div className="flex items-center -space-x-8 opacity-80 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-10 w-10 text-yellow-500/30 stroke-[1]" />
                <ChevronRight className="h-10 w-10 text-yellow-500/60 stroke-[1]" />
                <ChevronRight className="h-10 w-10 text-yellow-500 stroke-[1]" />
            </div>
        )
    }
    return (
        <div className="flex items-center -space-x-8 opacity-80 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="h-10 w-10 text-white/30 stroke-[1]" />
            <ChevronRight className="h-10 w-10 text-white/60 stroke-[1]" />
            <ChevronRight className="h-10 w-10 text-white stroke-[1]" />
        </div>
    )
}

export function PlansClient({ project }: PlansClientProps) {
    const plans = project.plans?.list || [];
    const cover = project.plans?.cover;

    // Initialize to -1 (cover) if cover exists, otherwise 0 (first plan)
    const [currentIndex, setCurrentIndex] = useState(cover ? -1 : 0);

    const handleNext = useCallback(() => {
        // If we are at the last plan
        if (currentIndex === plans.length - 1) {
            setCurrentIndex(cover ? -1 : 0);
            return;
        }

        // Otherwise just go to next index
        setCurrentIndex(prev => prev + 1);
    }, [currentIndex, plans.length, cover]);

    const handlePrev = useCallback(() => {
        const minIndex = cover ? -1 : 0;
        if (currentIndex > minIndex) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex, cover]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, handlePrev]);

    if (plans.length === 0 && !cover) {
        return (
            <div className="flex h-full items-center justify-center text-zinc-500">
                <span className="text-zinc-500 font-[family-name:var(--font-secondary)]">No hay planos disponibles.</span>
            </div>
        );
    }

    let imgUrl: string | null = null;
    let altText: string = "";

    if (currentIndex === -1 && cover) {
        imgUrl = getStrapiMedia(cover.url);
        altText = cover.alternativeText || project.plans?.title || "Plans Cover";
    } else if (currentIndex >= 0 && plans[currentIndex]) {
        const currentPlan = plans[currentIndex];
        imgUrl = getStrapiMedia(currentPlan.picture?.url);
        altText = currentPlan.picture?.alternativeText || currentPlan.description || "Plan";
    }

    const showPrev = currentIndex > (cover ? -1 : 0);

    return (
        <div className="flex flex-col h-[calc(100vh)] w-full overflow-hidden bg-white/5">
            {/* Image Section */}
            <div className="relative flex-1 min-h-0 w-full">


                {/* Main Image Area */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="relative h-full w-full"
                        >
                            {imgUrl && (
                                <img
                                    src={imgUrl}
                                    alt={altText}
                                    className="h-full w-full object-contain"
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows */}
                {currentIndex !== -1 && cover && (<>
                    <div className="absolute inset-y-0 left-0 z-20 flex items-center pl-4 pointer-events-none">
                        {showPrev && (
                            <button
                                onClick={handlePrev}
                                className="pointer-events-auto p-4 group focus:outline-none"
                            >
                                <ArrowPrev />
                            </button>
                        )}
                    </div>

                    <div className="absolute inset-y-0 right-0 z-20 flex items-center pr-4 pointer-events-none">
                        <button
                            onClick={handleNext}
                            className="pointer-events-auto p-4 group focus:outline-none"
                        >
                            <ArrowNext isLast={currentIndex === plans.length - 1} />
                        </button>
                    </div>
                </>
                )}
            </div>

            {/* Bottom Navigation Strip */}
            {plans.length > 0 && (
                <div className="relative w-full bg-black z-30 shrink-0">
                    {cover && currentIndex !== -1 && (
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
                            <button
                                onClick={() => setCurrentIndex(-1)}
                                className={cn(
                                    "group flex items-center justify-center rounded-full border w-10 h-10 transition-all duration-300",
                                    currentIndex === -1
                                        ? "border-white/40 bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                        : "border-white/10 bg-transparent text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                                )}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                    <div className="flex w-full items-center justify-center gap-4 py-6 md:gap-6 overflow-x-auto px-4">
                        {plans.map((plan, index) => (
                            <button
                                key={plan.id}
                                onClick={() => setCurrentIndex(index)}
                                className={cn(
                                    "group relative flex items-center gap-2 rounded-full border px-6 py-2 transition-all duration-300 whitespace-nowrap",
                                    currentIndex === index
                                        ? "border-white/40 bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                        : "border-white/10 bg-transparent text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                                )}
                            >
                                {currentIndex === index && (
                                    <motion.span
                                        layoutId="active-indicator"
                                        className="absolute inset-0 rounded-full bg-white/5"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {currentIndex === index && (
                                    <ChevronsRight className="h-4 w-4 animate-pulse text-white/70" />
                                )}

                                <span className="relative text-xs font-medium tracking-[0.2em] uppercase">
                                    {plan.description || `PLAN ${index + 1}`}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
