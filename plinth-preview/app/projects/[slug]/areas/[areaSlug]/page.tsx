import { notFound } from "next/navigation";
import { getProjectAreas } from "@/lib/strapi/api";
import { AreaDetailClient } from "./area-detail-client";
import { Room } from "@/lib/types";
import { slugify } from "@/lib/utils";

interface PageProps {
    params: Promise<{
        slug: string;
        areaSlug: string;
    }>;
}

export default async function AreaDetailPage({ params }: PageProps) {
    const { slug, areaSlug } = await params;
    const project = await getProjectAreas(slug);

    if (!project) {
        notFound();
    }

    // Find the specific area (room) by matching a slugified version of its name
    // Access areas.list instead of areas directly, as per new schema structure
    const room = project.areas?.list?.find((r: Room) => 
        slugify(r.name) === areaSlug
    );

    if (!room) {
        notFound();
    }

    return <AreaDetailClient project={project} room={room} />;
}

