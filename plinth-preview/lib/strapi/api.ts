import qs from 'qs';
import { Project } from '../types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    ...options,
  };

  const queryString = qs.stringify(urlParamsObject, { encodeValuesOnly: true });
  const requestUrl = `${STRAPI_URL}/api${path}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(requestUrl, mergedOptions);
    if (!response.ok) {
        console.error(`Strapi API Error: ${response.status} ${response.statusText}`);
        return { data: [] };
    }
    return await response.json();
  } catch (error) {
    console.error('Strapi fetch error:', error);
    return { data: [] };
  }
}

export async function getAllProjects(): Promise<Project[]> {
  const data = await fetchAPI('/projects', {
    populate: '*',
    sort: ['createdAt:desc'],
  });
  
  if (!data || !data.data) {
    console.warn('getAllProjects: No data received from Strapi');
    return [];
  }
  
  return Array.isArray(data.data) ? data.data : [data.data];
}

const PROJECT_POPULATE = {
    heroVideo: true,
    inspiration: {
        populate: {
            gallery: true,
            video: true,
            cover: true
        }
    },
    colors: {
        populate: {
            video: true,
            palette: true
        }
    },
    materials: {
        populate: {
            gallery: true,
            video: true
        }
    },
    areas: {
        populate: {
            video: true,
            cover: true,
            list: {
                populate: {
                    video: true,
                    photos: true
                }
            }
        }
    },
    plans: {
        populate: {
            cover: true,
            list: {
                populate: {
                    picture: true
                }
            }
        }
    }
};

export async function getProject(slug: string): Promise<Project | null> {
  const data = await fetchAPI('/projects', {
    filters: { slug: { $eq: slug } },
    populate: PROJECT_POPULATE
  });

  if (!data || !data.data || data.data.length === 0) {
      console.warn(`getProject: Project with slug "${slug}" not found`);
      return null;
    }
  
  return data.data[0];
}

export async function getProjectAreas(slug: string): Promise<Project | null> {
    // Reusing the same population logic or keeping it specific if needed.
    // Since getProject now populates areas deeply, we could just use getProject.
    // But keeping it for backward compat or if we want to add more specific area logic later.
    return getProject(slug);
}

// Helper to get full URL from Strapi media
export function getStrapiMedia(url: string | undefined | null) {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }
    return `${STRAPI_URL}${url}`;
}
