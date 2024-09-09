import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const convertToBase64 = (file: File | string): Promise<string> => {
  if (typeof file === 'string') {
    return Promise.resolve(file);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);  // Resolve as a string (Base64)
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};