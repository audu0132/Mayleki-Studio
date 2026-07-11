import React from "react";
import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-[#ec4899]",
  iconBg = "bg-[#ec4899]/10",
  trendValue,
  trendDirection = "up", // "up" | "down"
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, borderColor: "rgba(255, 255, 255, 0.12)" }}
      className={`bg-[#111827] border border-white/8 p-5 rounded-2xl shadow-xl flex flex-col justify-between h-32 relative overflow-hidden group transition-all ${className}`}
      {...props}
    >
      <div className="flex justify-between items-center text-white">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`${iconBg} ${iconColor} p-2 rounded-xl border border-white/5`}>
            <Icon size={14} />
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-end mt-auto">
        <h3 className="text-3xl font-black text-white tracking-tight leading-none">{value}</h3>
        {trendValue && (
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
            trendDirection === "up" 
              ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20" 
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}>
            {trendDirection === "up" ? "▲" : "▼"} {trendValue}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
