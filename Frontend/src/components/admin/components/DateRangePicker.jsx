import React from 'react';

export const DateRangePicker = ({ startDate, endDate, onChange }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <input
        type="date"
        value={startDate || ''}
        onChange={(e) => onChange({ startDate: e.target.value, endDate })}
        className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
      />
      <span className="text-neutral-400">to</span>
      <input
        type="date"
        value={endDate || ''}
        onChange={(e) => onChange({ startDate, endDate: e.target.value })}
        className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
      />
    </div>
  );
};

export default DateRangePicker;
