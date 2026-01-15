import { getProject } from '@/lib/strapi/api';
import { notFound } from 'next/navigation';
import { InspirationClient } from './inspiration-client';

export default async function InspirationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }
    
    return (
        <div className="w-full h-screen"> 
            <InspirationClient project={project} />
        </div>
    );
}

