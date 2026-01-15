"use client";

import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function ProjectLayoutClient({
    children,
    slug,
}: {
    children: React.ReactNode;
    slug: string;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const isProjectHome = pathname === `/projects/${slug}`;

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-zinc-950">
            {!isProjectHome && (
                <button 
                    onClick={() => router.push(`/projects/${slug}`)} 
                    className="fixed top-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-black/20 backdrop-blur-sm transition-colors hover:bg-black/40 cursor-pointer"
                >
                    <Menu className="h-5 w-5 text-white" />
                </button>
            )}
            <main className="flex-1 p-0 h-screen">
                {children}
            </main>
        </div>
    );
}

