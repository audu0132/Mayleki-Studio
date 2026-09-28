/**
 * Image Optimization Utilities
 * Formats image sources for responsive srcset rendering.
 */

export const getOptimizedImageUrl = (url, { width = 800, quality = 80 } = {}) => {
  if (!url) return '/placeholder-image.jpg';
  
  // If hosted on Cloudinary or CDN, apply transformations
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
  }

  return url;
};

export const generateSrcSet = (url) => {
  if (!url) return '';
  return [
    `${getOptimizedImageUrl(url, { width: 400 })} 400w`,
    `${getOptimizedImageUrl(url, { width: 800 })} 800w`,
    `${getOptimizedImageUrl(url, { width: 1200 })} 1200w`
  ].join(', ');
};
