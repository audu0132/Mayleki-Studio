import React, { useState, useEffect } from 'react';

export const SearchBar = ({ placeholder = 'Search...', onSearch, debounceMs = 300, className = '' }) => {
  const [term, setTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch) onSearch(term);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [term, debounceMs, onSearch]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
      />
      <span className="absolute left-3 text-neutral-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" strokeWidth="2" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
        </svg>
      </span>
      {term && (
        <button
          type="button"
          onClick={() => setTerm('')}
          className="absolute right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default SearchBar;
