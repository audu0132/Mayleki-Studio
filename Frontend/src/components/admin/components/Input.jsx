import React from "react";

const Input = ({
  label,
  placeholder,
  value = "",
  onChange,
  type = "text",
  maxLength,
  error,
  icon: Icon,
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
        {Icon && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
            <Icon size={14} />
          </span>
        )}
        <input
          type={type}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white dark:bg-[#0c0b10] border rounded-xl p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899] transition-all ${
            Icon ? "pl-10" : "pl-3.5"
          } ${maxLength ? "pr-14" : "pr-3.5"} ${
            error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500" : "border-slate-200 dark:border-[#232033]"
          }`}
          required={required}
          {...props}
        />
        {maxLength && (
          <span className="absolute right-3.5 top-3.5 text-[9px] font-bold text-gray-600 select-none">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && <span className="text-[10px] font-semibold text-red-400 block mt-1">{error}</span>}
    </div>
  );
};

export default Input;
