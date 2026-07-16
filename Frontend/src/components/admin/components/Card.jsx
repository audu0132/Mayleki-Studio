import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  actions,
  className = "",
  hoverable = false,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverable ? { y: -2, borderColor: "rgba(236, 72, 153, 0.2)" } : {}}
      className={`bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/8 text-gray-800 dark:text-[#f4f4f5] rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all ${className}`}
      {...props}
    >
      {(title || subtitle || Icon || actions) && (
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/8 pb-4 mb-5">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="text-[#ec4899]" size={16} />}
            <div>
              {title && <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-900 dark:text-white">{title}</h3>}
              {subtitle && <p className="text-[10px] text-gray-500 mt-0.5 leading-none">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;
