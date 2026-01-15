import { getProject } from '@/lib/strapi/api';
import { notFound } from 'next/navigation';
import { ColorsClient } from './colors-client';

export default async function ColorsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }
    
    return (
        <div className="w-full h-screen"> 
            <ColorsClient project={project} />
        </div>
    );
}
