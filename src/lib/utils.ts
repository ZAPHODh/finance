import { generateRandomString, type RandomReader } from "@oslojs/crypto/random";
import { clsx, type ClassValue } from "clsx"
import slugify from 'slugify';
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

export function getInitials(name: string, maxLength?: number): string {
  const initials = name
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase();

  if (maxLength !== undefined) {
    return initials.slice(0, maxLength);
  }

  return initials;
}

export function formatTime(hour: number) {
  return `${hour.toString().padStart(2, "0")}:00`
}

const alphanumeric =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateId(length = 10): string {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes);
    },
  };
  return generateRandomString(random, alphanumeric, length);
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}


const MAX_ATTEMPTS = 15;
const MAX_SLUG_LENGTH = 255;


const generateSlug = (text: string, maxLength: number = 240) => {
  if (!text.trim()) throw new Error('Title cannot be empty');

  const slug = slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

  return slug.substring(0, maxLength);
};


export const generateUniqueSlug = async (
  title: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelClient: any
) => {
  const baseSlug = generateSlug(title, MAX_SLUG_LENGTH - 10);
  let slug = baseSlug;
  let attempt = 1;

  while (attempt <= MAX_ATTEMPTS) {
    const existing = await modelClient.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) return slug;

    slug = `${baseSlug}-${attempt++}`;

    if (slug.length > MAX_SLUG_LENGTH) {
      const overflow = slug.length - MAX_SLUG_LENGTH;
      slug = `${baseSlug.substring(0, baseSlug.length - overflow)}-${attempt}`;
    }
  }

  throw new Error(`Failed to generate unique slug after ${MAX_ATTEMPTS} attempts`);
};