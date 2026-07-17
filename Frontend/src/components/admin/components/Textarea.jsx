import React from "react";

const Textarea = ({
  label,
  placeholder,
  value = "",
  onChange,
  rows = 4,
  maxLength,
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
        <textarea
          rows={rows}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white dark:bg-[#0c0b10] border rounded-xl p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899] transition-all resize-none ${
            maxLength ? "pb-8" : ""
          } ${
            error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500" : "border-slate-200 dark:border-[#232033]"
          }`}
          required={required}
          {...props}
        />
        {maxLength && (
          <span className="absolute right-3.5 bottom-3 text-[9px] font-bold text-gray-600 select-none">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && <span className="text-[10px] font-semibold text-red-400 block mt-1">{error}</span>}
    </div>
  );
};

export default Textarea;
