// To fix the error, first install the required package by running:
// npm install tailwind-merge
// or
// yarn add tailwind-merge

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
