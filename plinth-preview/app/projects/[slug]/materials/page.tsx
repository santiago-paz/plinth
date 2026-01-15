import { getProject } from '@/lib/strapi/api';
import { notFound } from 'next/navigation';
import { MaterialsClient } from './materials-client';

export default async function MaterialsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="h-screen">
            <MaterialsClient project={project} />
        </div>
    );
}

