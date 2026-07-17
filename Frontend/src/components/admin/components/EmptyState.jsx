import React from "react";
import { Sparkles } from "lucide-react";

const EmptyState = ({
  title = "No data found",
  description = "Get started by creating a new entry.",
  icon: Icon = Sparkles,
  actionButton,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/8 rounded-2xl shadow-xl space-y-4 max-w-lg mx-auto ${className}`}>
      
      {/* Central Icon */}
      <div className="p-4 rounded-full bg-[#ec4899]/5 text-[#ec4899] border border-[#ec4899]/15">
        <Icon size={32} />
      </div>

      {/* Text Details */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">{title}</h3>
        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">{description}</p>
      </div>

      {/* Optional Call to Action */}
      {actionButton && <div className="pt-2">{actionButton}</div>}

    </div>
  );
};

export default EmptyState;
