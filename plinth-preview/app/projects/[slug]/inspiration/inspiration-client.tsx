"use client";

import { getStrapiMedia } from "@/lib/strapi/api";
import { Project } from "@/lib/types";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface InspirationClientProps {
    project: Project;
}

// Separate component to handle individual image state and logic
function DraggableImage({
    item,
    index,
    pos,
    onClick,
    isActive,
    isDimmed
}: {
    item: any,
    index: number,
    pos: any,
    onClick: (id: number) => void,
    isActive: boolean,
    isDimmed: boolean
}) {
    const imgUrl = getStrapiMedia(item.url);

    if (!imgUrl) return null;

    return (
        <motion.div
            className={cn(
                "absolute overflow-visible rounded-sm shadow-3xl bg-zinc-800 group cursor-pointer transition-shadow duration-300",
                isActive ? "shadow-2xl ring-1 ring-white/10" : ""
            )}
            style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                width: pos.width,
                aspectRatio: "1/1",
                zIndex: isActive ? 50 : pos.zIndex,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: 1,
                scale: isActive ? 1.2 : 1,
                filter: isDimmed ? "brightness(0.4)" : "brightness(1)"
            }}
            transition={{
                scale: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.6 },
                filter: { duration: 0.3 }
            }}
            onClick={() => {
                onClick(item.id);
            }}
        >
            <div className="relative h-full w-full overflow-hidden">
                <img
                    src={imgUrl}
                    alt={item.name || "Inspiration"}
                    className="h-full w-full object-cover pointer-events-none"
                />
            </div>
        </motion.div>
    );
}

export function InspirationClient({ project }: InspirationClientProps) {
    const inspirationVideoUrl = getStrapiMedia(project.inspiration?.video?.url);
    const gallery = project.inspiration?.gallery || [];
    const [activeId, setActiveId] = useState<number | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { label: "INSPIRATION", href: `/projects/${project.slug}/inspiration` },
        { label: "COLORS", href: `/projects/${project.slug}/colors` },
        { label: "MATERIALS", href: `/projects/${project.slug}/materials` },
    ];

    const handleClick = (id: number) => {
        if (activeId === id) {
            setActiveId(null);
        } else {
            setActiveId(id);
        }
    };


    // Deterministic "random" positions based on index
    const getPosition = (index: number) => {
        const positions = [
            { top: "12%", left: "32%", width: "10rem", zIndex: 1 },
            { top: "15%", left: "10%", width: "10rem", zIndex: 1 },
            { top: "20%", left: "60%", width: "12rem", zIndex: 3 },
            { top: "42%", left: "15%", width: "11rem", zIndex: 2 },
            { top: "55%", left: "50%", width: "13rem", zIndex: 4 },
            { top: "72%", left: "25%", width: "10rem", zIndex: 1 },
            { top: "68%", right: "5%", width: "11rem", zIndex: 2 },
        ];
        const base = positions[index % positions.length];
        // Add slight variation for subsequent cycles
        const cycle = Math.floor(index / positions.length);
        return {
            ...base,
            top: `calc(${base.top} + ${cycle * 1.25}rem)`,
            left: base.left ? `calc(${base.left} + ${cycle * 1.25}rem)` : undefined,
            right: base.right ? `calc(${base.right} + ${cycle * 1.25}rem)` : undefined,
        };
    };

    const getText = (content: any) => {
        if (typeof content === 'string') return content;
        if (Array.isArray(content)) {
            return content.map((block: any) =>
                block.children?.map((child: any) => child.text).join('')
            ).join('\n\n');
        }
        return "Natural textures, warm wood, sculpted stone, and subtle metallic accents inspired a serene and timeless design. Soft light, neutral tones, and organic materials evoke Mediterranean calm and understated sophistication.";
    };

    return (
        <div className="flex h-full w-full flex-col gap-6 lg:flex-row lg:gap-0">
            {/* Left Side - Video */}
            <div className="relative h-[50vh] w-full overflow-hidden lg:h-full lg:w-auto lg:aspect-[9/16] lg:flex-none bg-zinc-950">
                {inspirationVideoUrl ? (
                    <video
                        src={inspirationVideoUrl}
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
                    <h1 className="text-4xl font-light tracking-wider font-[family-name:var(--font-primary)] md:text-5xl">
                        INSPIRATION
                    </h1>
                </div>
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
            </div>

            {/* Right Side - Gallery & Text */}
            <div className="relative flex h-[50vh] w-full flex-col bg-zinc-900/50 lg:h-full lg:flex-1 lg:rounded-r-2xl border-l border-white/5">
                
                {/* Top Navigation */}
                <div className="z-50 flex justify-center pt-8 pointer-events-none font-[family-name:var(--font-secondary)]">
                    <div className="flex gap-2 pointer-events-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => router.push(item.href)}
                                    className={cn(
                                        "px-4 py-2 text-sm tracking-widest rounded-lg border transition-all duration-300 backdrop-blur-sm cursor-pointer",
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

                {/* Scattered Gallery Container */}
                <div className="relative flex-1 w-full p-8">
                    {gallery.map((item, index) => (
                        <DraggableImage
                            key={item.id}
                            item={item}
                            index={index}
                            pos={getPosition(index)}
                            onClick={handleClick}
                            isActive={activeId === item.id}
                            isDimmed={activeId !== null && activeId !== item.id}
                        />
                    ))}
                </div>

                {/* Text Description */}
                <div className="relative z-10 w-full p-16 mt-auto">
                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg text-xs font-light leading-relaxed text-white first-letter:float-left first-letter:mr-3 first-letter:text-5xl 
                        font-[family-name:var(--font-secondary)] first-letter:font-[family-name:var(--font-primary)] first-letter:text-white first-letter:leading-[0.8] first-letter:mt-2 lg:first-letter:text-7xl">
                            {getText(project.inspiration?.text)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
