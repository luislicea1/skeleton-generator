"use client"
import { Icon } from "@iconify/react"
import { useTranslation } from "../context/language-context"
import { formatBytes, useUploader } from "../hooks/useUploader"
import type { SkeletonMode, SvgData } from "../types/skeleton"

interface UploaderProps {
  mode: SkeletonMode
  onModeChange: (mode: SkeletonMode) => void
  onLoad: (data: SvgData) => void
}

export default function Uploader({ mode, onModeChange, onLoad }: Readonly<UploaderProps>) {
  const t = useTranslation()
  const {
    inputRef,
    isDragging,
    error,
    filename,
    imageUrl,
    processing,
    sizeInfo,
    reduction,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleChange
  } = useUploader({ mode, onLoad })

  const MODES = [
    { value: "precise" as SkeletonMode, label: t.uploader.modePrecise, desc: t.uploader.modePreciseDesc },
    { value: "silhouette" as SkeletonMode, label: t.uploader.modeSilhouette, desc: t.uploader.modeSilhouetteDesc }
  ]

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Mode selector */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {t.uploader.algorithm}
        </span>
        <div className="grid grid-cols-2 gap-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => onModeChange(m.value)}
              className={[
                "group relative flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl border text-left cursor-pointer",
                mode === m.value
                  ? "border-indigo-400 bg-indigo-50 ring-1 ring-indigo-400/30 dark:border-indigo-500 dark:bg-indigo-950/40 dark:ring-indigo-500/30"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700/60 dark:bg-gray-900/40 dark:hover:border-gray-600 dark:hover:bg-gray-800/40"
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <div
                  className={[
                    "w-2 h-2 rounded-full",
                    mode === m.value ? "bg-indigo-500 dark:bg-indigo-400" : "bg-gray-300 dark:bg-gray-600"
                  ].join(" ")}
                />
                <span
                  className={[
                    "text-sm font-medium",
                    mode === m.value ? "text-indigo-600 dark:text-indigo-300" : "text-gray-600 dark:text-gray-300"
                  ].join(" ")}
                >
                  {m.label}
                </span>
              </div>
              <span className="text-[11px] leading-tight text-gray-400 dark:text-gray-500 pl-4">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!imageUrl && !processing ? () => inputRef.current?.click() : undefined}
        className={[
          "relative w-full rounded-2xl border-2 border-dashed overflow-hidden",
          isDragging
            ? "border-indigo-400 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30"
            : imageUrl
              ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50"
              : "border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-indigo-600 dark:hover:bg-gray-800/50 cursor-pointer"
        ].join(" ")}
      >
        {processing ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mode === "silhouette" ? t.uploader.processingSilhouette : t.uploader.processingPrecise}
            </p>
          </div>
        ) : imageUrl ? (
          <div className="flex flex-col">
            <div className="flex items-center justify-center p-6 min-h-52 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#f9fafb_0%_50%)] dark:bg-[repeating-conic-gradient(#1f2937_0%_25%,#111827_0%_50%)] bg-size-[20px_20px]">
              <img src={imageUrl} alt={filename ?? ""} className="max-w-full max-h-48 object-contain drop-shadow-lg" />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800/60 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-2 min-w-0">
                <Icon icon="lucide:image" className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{filename}</span>
              </div>
              <button
                onClick={() => inputRef.current?.click()}
                className="flex-none text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white dark:border-gray-700/50 cursor-pointer"
              >
                {t.uploader.change}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12 px-6">
            <div
              className={[
                "flex items-center justify-center w-14 h-14 rounded-2xl",
                isDragging ? "bg-indigo-100 dark:bg-indigo-500/20" : "bg-gray-100 dark:bg-gray-800"
              ].join(" ")}
            >
              <Icon
                icon="lucide:upload"
                className={[
                  "w-7 h-7",
                  isDragging ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"
                ].join(" ")}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {t.uploader.dropzoneTitle}{" "}
                <span className="text-indigo-500 dark:text-indigo-400 underline">{t.uploader.dropzoneCta}</span>
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t.uploader.dropzoneHint}</p>
            </div>
          </div>
        )}
      </div>

      {/* Size reduction */}
      {sizeInfo && reduction !== null && !processing && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
          <Icon icon="lucide:trending-up" className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span className="text-xs text-emerald-600 dark:text-emerald-300">
            {formatBytes(sizeInfo.original)} → {formatBytes(sizeInfo.skeleton)}
            {reduction > 0 && <span className="ml-1 font-semibold">(-{reduction}%)</span>}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-red-500 dark:text-red-400 text-sm">
          <Icon icon="lucide:triangle-alert" className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
