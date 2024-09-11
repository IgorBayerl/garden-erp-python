import { clsx, type ClassValue } from "clsx"
import { FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge"
import { ZodSchema, ZodError } from "zod";

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

/**
 * For when zod validation fails, don't show the error message
 */
export const customZodResolver = (schema: ZodSchema) => {
  return async (values: FieldValues) => {
    try {
      const parsedData = schema.parse(values);
      return {
        values: parsedData,
        errors: {},
      };
    } catch (error) {
      if (error instanceof ZodError) {
        // Log Zod validation errors to the console
        console.error("Zod validation errors:", error.errors);

        // Map Zod errors to a format that react-hook-form understands
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path.join(".")] = {
            type: curr.code,
            message: curr.message,
          };
          return acc;
        }, {} as Record<string, { type: string; message: string }>);

        return {
          values: {},
          errors: fieldErrors,
        };
      }

      // If there's any unexpected error, log it to the console
      console.error("Unexpected error during validation:", error);

      return {
        values: {},
        errors: {},
      };
    }
  };
};