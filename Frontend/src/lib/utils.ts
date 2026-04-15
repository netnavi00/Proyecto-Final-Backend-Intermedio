
/**
 * Utilidad para gestionar clases de Tailwind CSS de forma dinámica.
 * * - 'clsx': Permite aplicar clases condicionales de forma limpia (ej. { 'bg-red-500': hasError }).
 * - 'twMerge': Resuelve conflictos de Tailwind (ej. si pasas 'p-2' y luego 'p-4', se queda con el último).
 * * @param inputs - Lista de clases, objetos o condiciones.
 * @returns Un string de clases limpio y sin duplicados.
 */


import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
