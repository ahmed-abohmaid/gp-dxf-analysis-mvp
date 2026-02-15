import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

export function convertWattsToKVA(watts: number, pf: number = 1): number {
  return watts / (1000 * pf);
}

export function convertKVAToWatts(kva: number, pf: number = 1): number {
  return kva * 1000 * pf;
}

export function formatKVA(watts: number, pf: number = 1): string {
  return formatNumber(convertWattsToKVA(watts, pf), 2);
}
