import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#07070a] backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`w-full max-w-lg bg-[#111827] border border-white/8 rounded-2xl p-6 shadow-2xl relative overflow-hidden z-10 max-h-[90vh] flex flex-col ${className}`}
          >
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 shrink-0">
              {title && <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
