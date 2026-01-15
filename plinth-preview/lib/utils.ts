import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD") // Split accented characters into their base chars and diacritical marks
        .replace(/[\u0300-\u036f]/g, "") // Remove all the accents, which happen to be all in the \u03xx range
        .trim() // Trim leading/trailing whitespace
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}
