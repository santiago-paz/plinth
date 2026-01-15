"use client";

import { getStrapiMedia } from "@/lib/strapi/api";
import { Project, StrapiMedia } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface MaterialsClientProps {
    project: Project;
}

export function MaterialsClient({ project }: MaterialsClientProps) {
    const materialsVideoUrl = getStrapiMedia(project.materials?.video?.url);
    const materials = project.materials?.gallery || [];
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { label: "INSPIRATION", href: `/projects/${project.slug}/inspiration` },
        { label: "COLORS", href: `/projects/${project.slug}/colors` },
        { label: "MATERIALS", href: `/projects/${project.slug}/materials` },
    ];

    return (
        <div className="flex h-full w-full flex-col gap-6 lg:flex-row lg:gap-0">
            {/* Left Side - Video */}
            <div className="relative h-[50vh] w-full overflow-hidden lg:h-full lg:w-auto lg:aspect-[9/16] lg:flex-none bg-zinc-950">
                {materialsVideoUrl ? (
                    <video
                        src={materialsVideoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover opacity-80"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                        <span className="text-zinc-500">No hay video disponible</span>
                    </div>
                )}
                <div className="absolute bottom-8 left-8 z-10">
                    <h1 className="text-4xl font-serif font-light tracking-wider text-white md:text-5xl">
                        MATERIALS
                    </h1>
                </div>
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
            </div>

            {/* Right Side - Materials & Text */}
            <div className="relative flex h-[50vh] w-full flex-col bg-zinc-900/50 lg:h-full lg:flex-1 lg:rounded-r-2xl border-l border-white/5">
                {/* Top Navigation */}
                <div className="flex justify-center pt-8 pointer-events-none">
                    <div className="flex gap-2 pointer-events-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => router.push(item.href)}
                                    className={cn(
                                        "px-4 py-2 text-sm tracking-widest rounded-lg border transition-all duration-300 backdrop-blur-sm",
                                        isActive
                                            ? "border-white/20 bg-white/10 text-white"
                                            : "border-transparent text-zinc-500 hover:text-white hover:border-white/10"
                                    )}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Materials Grid Container */}
                <div className="relative flex-1 w-full p-8 flex items-center justify-center lg:items-end lg:pb-0">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 max-w-2xl w-full lg:flex lg:flex-row lg:max-w-none h-full lg:px-12">
                        {materials.map((material: StrapiMedia, index: number) => (
                            <motion.div
                                key={index}
                                layout
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                    opacity: 1, 
                                    flex: activeIndex === index ? 6 : 1,
                                    y: 0 
                                }}
                                style={{ zIndex: activeIndex === index ? 10 : 1 }}
                                transition={{
                                    layout: { duration: 0.4, type: "spring", bounce: 0.2 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="group flex flex-col items-center gap-3 lg:h-full lg:gap-0 lg:relative cursor-pointer"
                            >
                                <div
                                    className="relative h-32 w-full rounded-sm shadow-lg transition-transform duration-300 border border-white/10 overflow-hidden lg:h-full lg:rounded-none lg:border-x lg:border-y-0 lg:origin-bottom"
                                >
                                    <img
                                        src={getStrapiMedia(material.url) || ""}
                                        alt={material.name || "Material"}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Text Description */}
                {project.materials?.description && (
                    <div className="relative z-10 w-full p-16 mt-auto">
                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg text-xs font-light leading-relaxed text-white first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-[family-name:var(--font-didot)] first-letter:text-white first-letter:leading-[0.8] first-letter:mt-2 lg:first-letter:text-7xl">
                                {project.materials?.description}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
