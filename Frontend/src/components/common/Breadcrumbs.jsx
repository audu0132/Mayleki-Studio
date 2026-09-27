import React from 'react';
import { Link } from 'react-router-dom';

export const Breadcrumbs = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-neutral-500 py-3">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-gold transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center space-x-2">
              <span className="text-neutral-400">/</span>
              {isLast || !item.href ? (
                <span className="font-medium text-neutral-800 dark:text-neutral-200" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.href} className="hover:text-gold transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
