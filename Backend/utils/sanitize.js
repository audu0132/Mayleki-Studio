/**
 * Input Sanitization Utility
 * Cleans string inputs to prevent XSS and NoSQL injection attempts.
 */

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '')
    .trim();
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Strip keys starting with '$' to prevent MongoDB query injection
    if (key.startsWith('$')) continue;
    if (typeof value === 'string') {
      clean[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

module.exports = {
  sanitizeString,
  sanitizeObject
};
