"use client"

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import ExportPanel from './ExportPanel';
import { useTranslation } from '../context/language-context';
import type { SvgData, AnimationType, Theme } from '../types/skeleton';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  svgData: SvgData;
  animation: AnimationType;
  duration: number;
  theme: Theme;
}

export default function ExportModal({
  isOpen,
  onClose,
  svgData,
  animation,
  duration,
  theme,
}: ExportModalProps) {
  const t = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Handle mount/unmount with animation
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!mounted) return null;

  const themeLabel = theme === 'dark' ? t.exportModal.themeDark : t.exportModal.themeLight;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className={[
          'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200',
          visible ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.exportModal.title}
        className={[
          'relative w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[85vh] flex flex-col',
          'rounded-t-2xl sm:rounded-2xl',
          'bg-white dark:bg-gray-900',
          'border-t border-x sm:border border-gray-200 dark:border-gray-800',
          'shadow-2xl shadow-black/30',
          'transition-all duration-200',
          visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6 sm:translate-y-2',
        ].join(' ')}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 shrink-0">
              <Icon icon="lucide:download" className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                {t.exportModal.title}
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                {svgData.width} × {svgData.height} · {themeLabel}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t.exportModal.close}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body — scrollable */}
        <div className="overflow-y-auto p-5 flex-1">
          <ExportPanel
            svgData={svgData}
            animation={animation}
            duration={duration}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}
