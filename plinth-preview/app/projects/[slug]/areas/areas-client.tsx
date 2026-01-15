"use client";

import { getStrapiMedia } from "@/lib/strapi/api";
import { Project } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn, slugify } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Menu } from "lucide-react";

interface AreasClientProps {
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

function ArrowNext() {
    return (
        <div className="flex items-center -space-x-8 opacity-80 group-hover:opacity-100 transition-opacity">
            {/* Visual cue for "Next Section" - using a different color/opacity pattern */}
            <ChevronRight className="h-10 w-10 text-yellow-500/30 stroke-[1]" />
            <ChevronRight className="h-10 w-10 text-yellow-500/60 stroke-[1]" />
            <ChevronRight className="h-10 w-10 text-yellow-500 stroke-[1]" />
        </div>
    )
}

export function AreasClient({ project }: AreasClientProps) {
    const areasVideoUrl = getStrapiMedia(project.areas?.video?.url);
    const rooms = project.areas?.list || [];
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

    useEffect(() => {
        const roomSlug = searchParams.get("room");
        if (roomSlug && rooms.length > 0) {
            const index = rooms.findIndex(r => slugify(r.name) === roomSlug);
            if (index !== -1) {
                setSelectedRoomIndex(index);
                setCurrentPhotoIndex(0);
            }
        }
    }, [searchParams, rooms]);

    const handleRoomClick = (index: number) => {
        const room = rooms[index];
        const photos = room.photos || [];

        // Case B: If more than 1 photo, navigate to detail page
        if (photos.length > 1) {
            const areaSlug = slugify(room.name);
            router.push(`/projects/${project.slug}/areas/${areaSlug}`);
            return;
        }

        // Case A: If 1 (or 0) photo, open modal slideshow
        setSelectedRoomIndex(index);
        setCurrentPhotoIndex(0);
    };

    const handleClose = useCallback(() => {
        setSelectedRoomIndex(null);
        setCurrentPhotoIndex(0);
        if (searchParams.get("room")) {
            router.replace(`/projects/${project.slug}/areas`, { scroll: false });
        }
    }, [router, project.slug, searchParams]);

    const handleNext = useCallback(() => {
        if (selectedRoomIndex === null) return;

        const currentRoom = rooms[selectedRoomIndex];
        const photos = currentRoom.photos || [];

        // If current room has multiple photos and we are not at the end
        if (currentPhotoIndex < photos.length - 1) {
            setCurrentPhotoIndex(prev => prev + 1);
            return;
        }

        // Check next room
        const nextRoomIndex = selectedRoomIndex + 1;

        if (nextRoomIndex < rooms.length) {
            const nextRoom = rooms[nextRoomIndex];
            const nextPhotos = nextRoom.photos || [];

            if (nextPhotos.length > 1) {
                const areaSlug = slugify(nextRoom.name);
                router.push(`/projects/${project.slug}/areas/${areaSlug}`);
            } else {
                setSelectedRoomIndex(nextRoomIndex);
                setCurrentPhotoIndex(0);
                // Update URL to reflect new room if desired, or keep clean
                // router.replace(...) 
            }
        } else {
            setSelectedRoomIndex(null);
        }
    }, [selectedRoomIndex, rooms, currentPhotoIndex, project.slug, router]);

    const handlePrev = useCallback(() => {
        if (selectedRoomIndex === null) return;

        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex(prev => prev - 1);
            return;
        }

        handleClose();
    }, [selectedRoomIndex, currentPhotoIndex, handleClose]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedRoomIndex === null) return;

            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "Escape") handleClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedRoomIndex, handleNext, handlePrev, handleClose]);

    const currentRoom = selectedRoomIndex !== null ? rooms[selectedRoomIndex] : null;
    const currentPhoto = currentRoom?.photos?.[currentPhotoIndex];

    return (
        <>
            <div className="flex h-screen w-full flex-col gap-6 lg:flex-row lg:gap-0 lg:overflow-hidden">
                {/* Left Side - Video */}
                <div className="relative h-[40vh] w-full overflow-hidden lg:h-full lg:w-auto lg:aspect-[9/16] lg:flex-none lg:rounded-r-none bg-zinc-950">
                    {areasVideoUrl ? (
                        <video
                            src={areasVideoUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-full w-full object-cover opacity-80"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                            <span className="text-zinc-500 font-[family-name:var(--font-secondary)]">No hay video disponible</span>
                        </div>
                    )}
                    <div className="absolute bottom-8 left-8 z-10">
                        <h1 className="text-4xl font-serif font-light tracking-wider text-white md:text-6xl">
                            AREAS
                        </h1>
                    </div>
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                </div>

                {/* Right Side - Gallery Grid */}
                <div className="relative flex h-[60vh] w-full flex-col bg-zinc-900/50 lg:h-full lg:flex-1 border-l border-white/5">

                    {/* Grid Container - Scrollable area */}
                    <div className="h-full w-full overflow-y-auto px-4 pb-4 pt-4 custom-scrollbar">
                        {rooms.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 pb-8">
                                {rooms.map((room, index) => {
                                    // Show first photo of the room as cover
                                    const coverPhoto = room.photos?.[0];
                                    if (!coverPhoto) return null;

                                    const imgUrl = getStrapiMedia(coverPhoto.url);
                                    if (!imgUrl) return null;

                                    return (
                                        <motion.div
                                            key={room.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-800 cursor-pointer"
                                            onClick={() => handleRoomClick(index)}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={room.name || "Area Image"}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
                                            <div className="absolute bottom-2 left-4 right-4 z-10">
                                                <span className="text-lg font-light text-white tracking-wide font-[family-name:var(--font-primary)] uppercase">
                                                    {room.name}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-zinc-500">No hay áreas disponibles</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Gallery Modal - Only for Case A (<= 1 photo) */}
            <AnimatePresence>
                {selectedRoomIndex !== null && currentPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
                    >
                        {/* Close Button (Left) */}
                        <button
                            onClick={handleClose}
                            className="absolute top-8 left-8 z-[110] p-2 text-white/50 hover:text-white transition-colors rounded-lg bg-black/40 backdrop-blur-md"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[110] p-4 text-white/70 hover:text-white transition-colors group"
                        >
                            <ArrowPrev />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[110] p-4 text-white/70 hover:text-white transition-colors group"
                        >
                            <ArrowNext />
                        </button>

                        {/* Main Image Container with Margins */}
                        <motion.div
                            key={`${selectedRoomIndex}-${currentPhotoIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 h-full w-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {(() => {
                                const currentImgUrl = getStrapiMedia(currentPhoto.url);
                                if (!currentImgUrl) return null;
                                return (
                                    <img
                                        src={currentImgUrl}
                                        alt={currentPhoto.name || "Gallery Image"}
                                        className="h-full w-full object-contain"
                                    />
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
