"use client"
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import type { SvgData, Theme, AnimationType } from '../types/skeleton';
import { ANIMATIONS, DURATION_MIN, DURATION_MAX, DURATION_STEP } from '../types/skeleton';
import { buildSkeletonSvgString } from '../utils/svgParser';
import { useAppTheme } from '../context/theme-context';
import { useTranslation } from '../context/language-context';

interface PreviewPanelProps {
  svgData: SvgData;
  animation: AnimationType;
  duration: number;
  onAnimationChange: (a: AnimationType) => void;
  onDurationChange: (d: number) => void;
}

function useBlobUrl(content: string, type: string): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const blob = new Blob([content], { type });
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [content, type]);

  return url;
}

export default function PreviewPanel({
  svgData,
  animation,
  duration,
  onAnimationChange,
  onDurationChange,
}: PreviewPanelProps) {
  const t = useTranslation();
  const { theme: appTheme } = useAppTheme();
  const skeletonTheme: Theme = appTheme === 'dark' ? 'dark' : 'light';

  const skeletonSvg = buildSkeletonSvgString(svgData, skeletonTheme, animation, duration);
  const skeletonUrl = useBlobUrl(skeletonSvg, 'image/svg+xml');

  const svgMeta = `${svgData.width} × ${svgData.height}`;

  const previewBg = skeletonTheme === 'dark'
    ? 'bg-gray-900 border-gray-700/50'
    : 'bg-white border-gray-200';

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t.preview.title}</h2>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{svgMeta}</span>
      </div>

      {/* Animation select */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {t.preview.animation}
        </label>
        <div className="relative">
          <select
            value={animation}
            onChange={(e) => onAnimationChange(e.target.value as AnimationType)}
            className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/60 px-3.5 py-2.5 pr-9 text-sm text-gray-700 dark:text-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          >
            {ANIMATIONS.map((anim) => (
              <option key={anim.id} value={anim.id}>
                {t.animations[anim.id]}
              </option>
            ))}
          </select>
          <Icon
            icon="lucide:chevron-down"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
          />
        </div>
      </div>

      {/* Duration slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.preview.duration}</p>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{duration.toFixed(1)}s</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-gray-600">{DURATION_MIN}s</span>
          <input
            type="range"
            min={DURATION_MIN}
            max={DURATION_MAX}
            step={DURATION_STEP}
            value={duration}
            onChange={(e) => onDurationChange(parseFloat(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-indigo-500 cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500
              [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-indigo-500/30
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-indigo-400"
          />
          <span className="text-xs text-gray-400 dark:text-gray-600">{DURATION_MAX}s</span>
        </div>
      </div>

      {/* Skeleton preview — background follows the app theme */}
      <div className={`flex items-center justify-center rounded-2xl border ${previewBg} min-h-64 p-6 overflow-hidden`}>
        {skeletonUrl ? (
          <img
            src={skeletonUrl}
            alt={t.preview.title}
            className="max-w-full max-h-56 object-contain"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
        {t.preview.smilNote}
      </p>
    </div>
  );
}
