import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCurrency(amount: number): string {
  if (amount < 0.001) {
    return `$${amount.toFixed(6)}`;
  }
  return `$${amount.toFixed(4)}`;
}

export function generateRandomKey(): { raw: string; masked: string } {
  const chars = 'abcdef0123456789';
  let rand = '';
  for (let i = 0; i < 24; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const raw = `sf_live_${rand}`;
  const masked = `sf_live_${rand.slice(0, 4)}...${rand.slice(-4)}`;
  return { raw, masked };
}