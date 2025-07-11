// import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes, opts = {}) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}
