import { getProject } from '@/lib/strapi/api';
import { notFound } from 'next/navigation';
import { ProjectHero } from './project-hero';

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    return <ProjectHero project={project} />;
}
