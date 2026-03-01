"use client"
import { Icon } from "@iconify/react"
import { useTranslation } from "../context/language-context"
import { useAnimationExport } from "../hooks/useAnimationExport"
import type { AnimationType, SvgData, Theme } from "../types/skeleton"

interface AnimationExportProps {
  svgData: SvgData
  animation: AnimationType
  theme: Theme
  duration: number
}

export default function AnimationExport({ svgData, animation, theme, duration }: Readonly<AnimationExportProps>) {
  const t = useTranslation()
  const { exportingGif, exportingWebm, gifProgress, webmProgress, exportAsGif, exportAsWebm } = useAnimationExport({
    svgData,
    animation,
    theme,
    duration,
  })

  const busy = exportingGif || exportingWebm

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {t.exportModal.animationExport}
      </p>

      <div className="flex gap-2">
        {/* GIF button */}
        <button
          onClick={exportAsGif}
          disabled={busy}
          className={[
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors",
            busy
              ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800/40 dark:border-gray-700/50 dark:text-gray-500"
              : "bg-white border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 dark:bg-gray-800/60 dark:border-gray-700/50 dark:text-gray-300 dark:hover:border-violet-500 dark:hover:text-violet-400 dark:hover:bg-violet-950/30 cursor-pointer"
          ].join(" ")}
        >
          {exportingGif ? (
            <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon icon="lucide:image" className="w-4 h-4" />
          )}
          {t.exportModal.exportGif}
        </button>

        {/* WebM button */}
        <button
          onClick={exportAsWebm}
          disabled={busy}
          className={[
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors",
            busy
              ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800/40 dark:border-gray-700/50 dark:text-gray-500"
              : "bg-white border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 dark:bg-gray-800/60 dark:border-gray-700/50 dark:text-gray-300 dark:hover:border-violet-500 dark:hover:text-violet-400 dark:hover:bg-violet-950/30 cursor-pointer"
          ].join(" ")}
        >
          {exportingWebm ? (
            <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon icon="lucide:video" className="w-4 h-4" />
          )}
          {t.exportModal.exportVideo}
        </button>
      </div>

      {/* GIF progress bar */}
      {exportingGif && (
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-100"
              style={{ width: `${gifProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t.exportModal.exportingProgress.replace('{n}', String(gifProgress))}
          </p>
        </div>
      )}

      {/* WebM progress bar */}
      {exportingWebm && (
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-100"
              style={{ width: `${webmProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t.exportModal.exportingProgress.replace('{n}', String(webmProgress))}
          </p>
        </div>
      )}
    </div>
  )
}
