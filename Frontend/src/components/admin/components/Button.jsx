import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#ec4899]/50 select-none cursor-pointer";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#d946ef] to-[#ec4899] hover:opacity-95 text-white shadow-md shadow-[#ec4899]/10",
    secondary: "bg-[#1f2937] hover:bg-[#374151] text-gray-200 border border-zinc-700/50",
    outline: "bg-transparent border border-zinc-700 hover:border-zinc-500 text-white hover:bg-white/5",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-xs uppercase tracking-wider",
    lg: "px-6 py-3 text-sm uppercase tracking-wider",
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${currentVariant} ${currentSize} ${className} ${
        (disabled || loading) ? "opacity-50 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
      {children}
    </motion.button>
  );
};

export default Button;
