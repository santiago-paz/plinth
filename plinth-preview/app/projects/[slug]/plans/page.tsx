import { getProject } from '@/lib/strapi/api';
import { notFound } from 'next/navigation';
import { PlansClient } from './plans-client';

export default async function PlansPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }
    
    return <PlansClient project={project} />;
}
