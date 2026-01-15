export interface StrapiImageFormat {
    url: string;
    width: number;
    height: number;
}

export interface StrapiMedia {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    url: string;
    formats: {
        thumbnail: StrapiImageFormat;
        small?: StrapiImageFormat;
        medium?: StrapiImageFormat;
        large?: StrapiImageFormat;
    };
}

export interface Room {
    id: number;
    name: string;
    video?: StrapiMedia;
    photos?: StrapiMedia[];
}

export interface PlanItem {
    id: number;
    picture: StrapiMedia;
    description?: string;
}

export interface InspirationSection {
    id: number;
    text?: any;
    gallery?: StrapiMedia[];
    video?: StrapiMedia;
    cover?: StrapiMedia;
}

export interface ColorItem {
    id: number;
    name: string;
    hex: string;
}

export interface ColorsSection {
    id: number;
    palette?: ColorItem[];
    description?: string;
    video?: StrapiMedia;
}

export interface MaterialsSection {
    id: number;
    gallery?: StrapiMedia[];
    description?: string;
    video?: StrapiMedia;
    // materialsVideo in schema? Yes "video" in component
}

export interface AreasSection {
    id: number;
    video?: StrapiMedia;
    cover?: StrapiMedia;
    list?: Room[];
}

export interface PlansSection {
    id: number;
    title?: string;
    cover?: StrapiMedia;
    list?: PlanItem[];
}

export interface Project {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    authorName: string;
    heroVideo?: StrapiMedia;
    
    inspiration?: InspirationSection;
    colors?: ColorsSection;
    materials?: MaterialsSection;
    areas?: AreasSection;
    plans?: PlansSection;

    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}
