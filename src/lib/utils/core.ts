import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export * from '../types/order-status'
export * from "./pricing"
export * from "./phone"
export * from "./error-handler"
