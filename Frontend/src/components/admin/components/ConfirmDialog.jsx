import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone. Please confirm to proceed.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  variant = "danger",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-sm">
      <div className="space-y-5 text-center py-2 flex flex-col items-center">
        
        {/* Warning Icon Banner */}
        <div className="p-3.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/15">
          <AlertTriangle size={28} />
        </div>

        {/* Details text */}
        <div className="space-y-1">
          <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">{description}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full pt-2">
          <Button
            variant="secondary"
            className="flex-1"
            disabled={loading}
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            className="flex-1"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default ConfirmDialog;
