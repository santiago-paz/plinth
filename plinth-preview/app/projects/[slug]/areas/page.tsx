import { getProjectAreas } from '@/lib/strapi/api';
import { notFound } from 'next/navigation';
import { AreasClient } from './areas-client';

export default async function AreasPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProjectAreas(slug);

    if (!project) {
        notFound();
    }
    
    return <AreasClient project={project} />;
}
