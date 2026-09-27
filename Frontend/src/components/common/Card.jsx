import React from 'react';

export const Card = ({ children, className = '', hover = true }) => {
  return (
    <div
      className={`bg-white dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 backdrop-blur-sm transition-all duration-300 ${
        hover ? 'hover:shadow-xl hover:border-gold/30 hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
