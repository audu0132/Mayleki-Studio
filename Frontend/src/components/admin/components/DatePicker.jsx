import React from "react";
import { Calendar } from "lucide-react";

const DatePicker = ({
  label,
  value = "",
  onChange,
  error,
  className = "",
  required = false,
  ...props
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
          {label} {required && <span className="text-[#ec4899]">*</span>}
        </label>
      )}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
          <Calendar size={14} />
        </span>
        <input
          type="date"
          value={value}
          onChange={onChange}
          className={`w-full bg-white dark:bg-[#0c0b10] border rounded-xl p-3 pl-10 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899] transition-all select-none ${
            error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500" : "border-slate-200 dark:border-[#232033]"
          }`}
          required={required}
          {...props}
        />
      </div>
      {error && <span className="text-[10px] font-semibold text-red-400 block mt-1">{error}</span>}
    </div>
  );
};

export default DatePicker;
