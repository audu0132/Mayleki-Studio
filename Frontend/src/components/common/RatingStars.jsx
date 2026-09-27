import React from 'react';

export const RatingStars = ({ rating = 5, max = 5, size = 'sm', interactive = false, onChange }) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="flex items-center space-x-1" aria-label={`${rating} out of ${max} stars`}>
      {stars.map((star) => {
        const isFilled = star <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(star)}
            className={`${interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}`}
          >
            <svg
              className={`${size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} ${
                isFilled ? 'text-amber-400 fill-amber-400' : 'text-neutral-300 dark:text-neutral-700'
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill={isFilled ? 'currentColor' : 'none'}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
