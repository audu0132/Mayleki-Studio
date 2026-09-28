import React from 'react';

export const StatusPill = ({ status = 'pending' }) => {
  const configs = {
    pending: { bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20', label: 'Pending' },
    confirmed: { bg: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: 'Confirmed' },
    completed: { bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', label: 'Completed' },
    cancelled: { bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20', label: 'Cancelled' }
  };

  const current = configs[status.toLowerCase()] || configs.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${current.bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {current.label}
    </span>
  );
};

export default StatusPill;
