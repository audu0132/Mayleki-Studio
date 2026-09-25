/**
 * Slugify Helper
 * Generates SEO-friendly URL slugs for services and category pages.
 */

const slugify = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')        // Replace spaces and underscores with -
    .replace(/[^\w\-]+/g, '')        // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')              // Trim - from start of text
    .replace(/-+$/, '');             // Trim - from end of text
};

module.exports = slugify;
