import React from "react";

const Table = ({
  headers = [],
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/8 rounded-2xl overflow-hidden shadow-xl ${className}`} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          
          {/* Table Header */}
          <thead className="bg-slate-50 dark:bg-[#0c0b10] border-b border-slate-200 dark:border-white/8 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 select-none">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-4 font-extrabold">{h}</th>
              ))}
            </tr>
          </thead>

          {/* Table Body Content */}
          <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium text-slate-700 dark:text-gray-300">
            {children}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Table;
