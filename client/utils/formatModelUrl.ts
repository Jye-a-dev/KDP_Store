/**
 * Converts a model URL or filename into a direct download URL.
 * Supports:
 * - Google Drive share links
 * - Full HTTP/HTTPS URLs (including Supabase URLs)
 * - Local relative paths (e.g. /uploads/3d/...) prepended with backend API URL
 * - Plain filenames uploaded directly to the Supabase storage bucket "3d model"
 */
export function formatModelUrl(url: string | null | undefined): string {
  if (!url) return "";

  const trimmed = url.trim();

  // 1. Google Drive direct link conversion
  const driveRegex = /(?:\/file\/d\/|id=)([a-zA-Z0-9_-]+)/;
  const match = trimmed.match(driveRegex);
  if (match && (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com"))) {
    const fileId = match[1];
    return `https://docs.google.com/uc?export=download&id=${fileId}`;
  }

  // 2. Full HTTP/HTTPS URLs
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // 3. Local relative paths (e.g., /uploads/3d/...)
  if (trimmed.startsWith("/") || trimmed.startsWith("uploads/")) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${baseUrl}${cleanPath}`;
  }

  // 4. Default: Plain filename uploaded directly to Supabase storage bucket "3d model"
  const bucketUrl = "https://jvjzdxblwznjlhoxsjux.supabase.co/storage/v1/object/public/3d%20model";
  return `${bucketUrl}/${encodeURIComponent(trimmed)}`;
}
