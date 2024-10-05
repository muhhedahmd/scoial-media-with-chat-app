import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const countries = [
  { code: "US", label: "United States", phone: "1", flag: "🇺🇸" },
  { code: "CA", label: "Canada", phone: "1", flag: "🇨🇦" },
  { code: "MX", label: "Mexico", phone: "52", flag: "🇲🇽" },
  { code: "DE", label: "Germany", phone: "49", flag: "🇩🇪" },
  { code: "FR", label: "France", phone: "33", flag: "🇫🇷" },
  { code: "GB", label: "United Kingdom", phone: "44", flag: "🇬🇧" },
  { code: "IT", label: "Italy", phone: "39", flag: "🇮🇹" },
  { code: "JP", label: "Japan", phone: "81", flag: "🇯🇵" },
  { code: "CN", label: "China", phone: "86", flag: "🇨🇳" },
  { code: "IN", label: "India", phone: "91", flag: "🇮🇳" },
  { code: "BR", label: "Brazil", phone: "55", flag: "🇧🇷" },
  { code: "ZA", label: "South Africa", phone: "27", flag: "🇿🇦" },
  { code: "EG", label: "Egypt", phone: "20", flag: "🇪🇬" },
  // Add more countries as needed
];


