/**
 * API Configuration
 * EXPO_PUBLIC_* variables are injected by Metro bundler at build time from .env
 * Fallback to production Render server if env var is not set
 */

// Sanitize: remove Windows \r carriage returns and trim whitespace
function sanitizeUrl(url: string): string {
  return url.replace(/\r/g, '').replace(/\n/g, '').trim();
}

const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL;

// Production Render server (always available as ultimate fallback)
const PRODUCTION_URL = 'https://kdp-store.onrender.com';

export const API_BASE_URL = RAW_API_URL
  ? sanitizeUrl(RAW_API_URL)
  : PRODUCTION_URL;

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  pageContents: `${API_BASE_URL}/page-contents`,
  products: `${API_BASE_URL}/products`,
  categories: `${API_BASE_URL}/categories`,
} as const;
