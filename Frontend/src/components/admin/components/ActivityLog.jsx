import React from 'react';

export const ActivityLog = ({ items = [] }) => {
  if (!items.length) {
    return <p className="text-xs text-neutral-400 py-4 text-center">No recent admin activity</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-xs">
          <span className="w-2 h-2 mt-1 rounded-full bg-gold shrink-0" />
          <div className="flex-1">
            <span className="font-medium text-neutral-800 dark:text-neutral-200">{item.action}</span>
            <p className="text-neutral-500">{item.description}</p>
          </div>
          <span className="text-neutral-400 shrink-0">{item.time}</span>
        </li>
      ))}
    </ul>
  );
};

export default ActivityLog;
