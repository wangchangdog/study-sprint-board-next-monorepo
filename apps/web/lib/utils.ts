import { clsx, type ClassValue } from "clsx";

/**
 * Tailwind CSS のクラス名を結合するユーティリティ。
 * 簡易版: clsx のような条件付きクラス結合を行う。
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
