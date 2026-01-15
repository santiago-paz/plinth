import { ProjectLayoutClient } from '@/components/project-layout-client';
import { getProject } from '@/lib/strapi/api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);

    return {
        title: `${project?.title} | ${project?.authorName}`,
    };
}

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    return (
        <ProjectLayoutClient slug={slug}>
            {children}
        </ProjectLayoutClient>
    );
}
