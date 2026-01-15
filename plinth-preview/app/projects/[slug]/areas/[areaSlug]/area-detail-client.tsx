"use client";

import { getStrapiMedia } from "@/lib/strapi/api";
import { Project, Room } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { slugify, cn } from "@/lib/utils";

interface AreaDetailClientProps {
    project: Project;
    room: Room;
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
                {/* Visual cue for "Next Section" - using a different color/opacity pattern */}
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

export function AreaDetailClient({ project, room }: AreaDetailClientProps) {
    // Use room-specific video if available, otherwise fallback to project areas video (or none)
    const videoUrl = getStrapiMedia(room.video?.url); 
    const photos = room.photos || [];
    const router = useRouter();

    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    const handleNext = useCallback(() => {
        if (selectedPhotoIndex === null) return;
        
        // If we are at the last photo
        if (selectedPhotoIndex === photos.length - 1) {
            // Find current room index
            const allRooms = project.areas?.list || [];
            const currentRoomIndex = allRooms.findIndex(r => r.id === room.id);
            const nextRoomIndex = currentRoomIndex + 1;
            
            if (nextRoomIndex < allRooms.length) {
                const nextRoom = allRooms[nextRoomIndex];
                const areaSlug = slugify(nextRoom.name);
                
                if ((nextRoom.photos?.length || 0) > 1) {
                    // Found a next room with multiple photos -> Navigate there
                    router.push(`/projects/${project.slug}/areas/${areaSlug}`);
                } else {
                    // Next room has single photo -> Navigate to main areas list with room param
                    router.push(`/projects/${project.slug}/areas?room=${areaSlug}`);
                }
                return;
            }

            // If no next room found -> Navigate back to main areas list
            router.push(`/projects/${project.slug}/areas`);
            return;
        }

        // Standard next photo behavior
        setSelectedPhotoIndex((prev) => 
            prev === null ? null : (prev + 1)
        );
    }, [photos.length, selectedPhotoIndex, project.areas, project.slug, room.id, router]);

    const handleClose = useCallback(() => {
        setSelectedPhotoIndex(null);
    }, []);

    const handlePrev = useCallback(() => {
        if (selectedPhotoIndex === null) return;

        if (selectedPhotoIndex > 0) {
            setSelectedPhotoIndex(selectedPhotoIndex - 1);
            return;
        }

        // If at first photo, close the modal to return to the area detail view
        handleClose();
    }, [selectedPhotoIndex, handleClose]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhotoIndex === null) return;
            
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "Escape") handleClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedPhotoIndex, handleNext, handlePrev, handleClose]);

    return (
        <>
            <div className="flex h-screen w-full flex-col gap-6 lg:flex-row lg:gap-0 lg:overflow-hidden">
                {/* Left Side - Video */}
                <div className="relative h-[40vh] w-full overflow-hidden lg:h-full lg:w-auto lg:aspect-[9/16] lg:flex-none lg:rounded-r-none bg-zinc-950">
                    {videoUrl ? (
                        <video
                            src={videoUrl}
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
                    

                    <div className="absolute bottom-8 left-8 z-10 flex items-center gap-4 max-w-[calc(100%-4rem)]">
                        
                        <button 
                            onClick={() => router.push(`/projects/${project.slug}/areas`)}
                            className="flex-shrink-0 flex items-center justify-center text-white/70 hover:text-white transition-colors group"
                        >
                            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 transwition-transform group-hover:-translate-x-1" />
                        </button>
                        <h1 className={cn(
                            "font-serif font-light tracking-wider text-white uppercase",
                            room.name.length > 10 
                                ? "text-2xl md:text-4xl leading-tight" 
                                : "text-4xl md:text-6xl"
                        )}>
                            {room.name}
                        </h1>
                    </div>
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                </div>

                {/* Right Side - Gallery Grid */}
                <div className="relative flex h-[60vh] w-full flex-col bg-zinc-900/50 lg:h-full lg:flex-1 border-l border-white/5">
                    
                    {/* Grid Container - Scrollable area */}
                    <div className="h-full w-full overflow-y-auto px-4 pb-4 pt-4 custom-scrollbar">
                        {photos.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 pb-8">
                                {photos.map((photo, index) => {
                                    const imgUrl = getStrapiMedia(photo.url);
                                    if (!imgUrl) return null;
                                    return (
                                        <motion.div
                                            key={photo.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-800 cursor-pointer"
                                            onClick={() => setSelectedPhotoIndex(index)}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={photo.name || `${room.name} Image`}
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-zinc-500">No hay fotos disponibles</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Gallery Modal */}
            <AnimatePresence>
                {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
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
                            <ArrowNext isLast={selectedPhotoIndex === photos.length - 1} />
                        </button>

                        {/* Main Image Container with Margins */}
                        <motion.div
                            key={selectedPhotoIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 h-full w-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            {(() => {
                                const currentImg = getStrapiMedia(photos[selectedPhotoIndex].url);
                                if (!currentImg) return null;
                                return (
                                    <img
                                        src={currentImg}
                                        alt={photos[selectedPhotoIndex].name || "Gallery Image"}
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

