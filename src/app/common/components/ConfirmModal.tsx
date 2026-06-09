'use client';

import React from 'react';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = 'Confirmar acción',
  message = '¿Estás seguro?',
  confirmText = 'Sí, eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />

      <div className="relative bg-slate-800 rounded-2xl p-6 max-w-lg w-full mx-4">
        <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-300 mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white">
            {cancelText}
          </button>

          <button onClick={onConfirm} className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
