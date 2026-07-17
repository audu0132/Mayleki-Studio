import React from "react";
import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-[#F9FAFB]",
  iconBg = "bg-[#F9FAFB]/10",
  trendValue,
  trendDirection = "up", // "up" | "down"
  className = "",
  ...props
}) => {
  const adjustColors = (colorStr) => {
    return colorStr
      .replace("text-[#F9FAFB]", "text-slate-650 dark:text-[#F9FAFB]")
      .replace("text-blue-400", "text-blue-600 dark:text-blue-400")
      .replace("text-green-400", "text-green-600 dark:text-green-400")
      .replace("text-purple-400", "text-purple-600 dark:text-purple-400")
      .replace("text-yellow-400", "text-yellow-600 dark:text-yellow-400")
      .replace("text-red-400", "text-red-650 dark:text-red-400")
      .replace("text-amber-400", "text-amber-600 dark:text-amber-400")
      .replace("bg-[#F9FAFB]/10", "bg-slate-100 dark:bg-[#F9FAFB]/10")
      .replace("bg-blue-500/10", "bg-blue-50 dark:bg-blue-500/10")
      .replace("bg-green-500/10", "bg-green-50 dark:bg-green-500/10")
      .replace("bg-purple-500/10", "bg-purple-50 dark:bg-purple-500/10")
      .replace("bg-yellow-500/10", "bg-yellow-50 dark:bg-yellow-500/10")
      .replace("bg-red-500/10", "bg-red-50 dark:bg-red-500/10")
      .replace("bg-amber-500/10", "bg-amber-50 dark:bg-amber-500/10");
  };

  const finalIconColor = adjustColors(iconColor);
  const finalIconBg = adjustColors(iconBg);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, borderColor: "rgba(236, 72, 153, 0.2)" }}
      className={`bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/8 p-5 rounded-2xl shadow-xl flex flex-col justify-between h-32 relative overflow-hidden group transition-all ${className}`}
      {...props}
    >
      <div className="flex justify-between items-center text-slate-800 dark:text-white">
        <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`${finalIconBg} ${finalIconColor} p-2 rounded-xl border border-slate-100 dark:border-white/5`}>
            <Icon size={14} />
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-end mt-auto">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{value}</h3>
        {trendValue && (
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
            trendDirection === "up" 
              ? "bg-emerald-50 dark:bg-[#22c55e]/10 text-emerald-600 dark:text-[#22c55e] border-emerald-100 dark:border-[#22c55e]/20" 
              : "bg-red-50 dark:bg-red-500/10 text-red-650 dark:text-red-400 border-red-100 dark:border-red-500/20"
          }`}>
            {trendDirection === "up" ? "▲" : "▼"} {trendValue}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
