export function getOptimizedCategoryImageUrl(url?: string, width = 800): string {
  if (!url || typeof url !== 'string' || !url.trim()) return '';
  const trimmed = url.trim();

  // Strip fake/stock/AI placeholders
  if (
    trimmed.includes('unsplash.com') ||
    trimmed.includes('pexels.com') ||
    trimmed.includes('placeholder')
  ) {
    return '';
  }

  // Inject Cloudinary automatic optimization parameters f_auto, q_auto, w_800
  if (trimmed.includes('res.cloudinary.com') && trimmed.includes('/upload/')) {
    if (!trimmed.includes('/upload/f_auto') && !trimmed.includes('/upload/q_auto')) {
      return trimmed.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    }
  }

  return trimmed;
}
