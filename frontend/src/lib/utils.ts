import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface FormatMessageTimeOptions {
  hour: "2-digit";
  minute: "2-digit";
  hour12: boolean;
}

export function formatMessageTime(date: string | number | Date): string {
  const options: FormatMessageTimeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return new Date(date).toLocaleTimeString("en-US", options);
}