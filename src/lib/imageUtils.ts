export function getOptimizedCategoryImageUrl(input?: any, width = 800): string {
  if (!input) return '';

  let rawUrl = '';
  if (typeof input === 'string') {
    rawUrl = input;
  } else if (typeof input === 'object') {
    rawUrl = input.image || input.imageUrl || input.image_url || input.url || '';
  }

  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return '';
  const trimmed = rawUrl.trim();

  if (trimmed === 'null' || trimmed === 'undefined') return '';

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
