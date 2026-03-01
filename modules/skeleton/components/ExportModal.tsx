"use client"

import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"
import { useTranslation } from "../context/language-context"
import { useAnimationExport } from "../hooks/useAnimationExport"
import { FRAMEWORKS, type AnimationType, type Framework, type SvgData, type Theme } from "../types/skeleton"
import { generateCode } from "../utils/generators"
import ExportPanel from "./ExportPanel"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  svgData: SvgData
  animation: AnimationType
  duration: number
  theme: Theme
}

const FRAMEWORK_ICON: Record<Framework, string> = {
  react: "logos:react",
  angular: "logos:angular-icon",
  vue: "logos:vue",
  "react-native": "logos:react",
  flutter: "logos:flutter"
}

export default function ExportModal({
  isOpen,
  onClose,
  svgData,
  animation,
  duration,
  theme
}: Readonly<ExportModalProps>) {
  const t = useTranslation()
  const [activeFramework, setActiveFramework] = useState<Framework>("react")
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)
  const [copied, setCopied] = useState(false)

  const activeConfig = FRAMEWORKS.find((f) => f.id === activeFramework)!
  const code = generateCode(activeFramework, svgData, theme, animation, duration)
  const downloadHref = `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`
  const fileExt = activeConfig.filename.split(".").pop()

  const { exportingGif, exportingWebm, gifProgress, webmProgress, exportAsGif, exportAsWebm } = useAnimationExport({
    svgData,
    animation,
    theme,
    duration
  })

  const busy = exportingGif || exportingWebm

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    if (isOpen) {
      setClosing(false)
      setMounted(true)
    } else if (mounted) {
      setClosing(true)
      const timer = setTimeout(() => {
        setMounted(false)
        setClosing(false)
      }, 850) // Wait for full animation (820ms + buffer)
      return () => clearTimeout(timer)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!mounted) return null

  const themeLabel = theme === "dark" ? t.exportModal.themeDark : t.exportModal.themeLight

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className={[
          "absolute inset-0 bg-black/70 backdrop-blur-sm",
          closing ? "animate-backdrop-out" : "animate-backdrop-in"
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full sm:max-w-6xl">
        <button
          onClick={onClose}
          aria-label={t.exportModal.close}
          className={[
            "absolute -top-4 -right-4 z-10",
            "flex items-center justify-center w-9 h-9 rounded-full",
            "bg-gray-900 dark:bg-gray-700 text-white shadow-lg",
            "hover:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer",
            closing ? "animate-modal-btn-out" : "animate-modal-btn"
          ].join(" ")}
        >
          <Icon icon="lucide:x" className="w-4 h-4" />
        </button>

        {!closing && (
          <div
            className="absolute inset-0 z-[-1] flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div className="w-full h-6 bg-gradient-to-b from-gray-300/70 via-gray-400/80 to-gray-300/70 dark:from-gray-500/70 dark:via-gray-400/80 dark:to-gray-500/70 rounded-full animate-modal-line" />
          </div>
        )}

        {closing && (
          <div
            className="absolute inset-0 z-[-1] flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div className="w-full h-6 bg-gradient-to-b from-gray-300/70 via-gray-400/80 to-gray-300/70 dark:from-gray-500/70 dark:via-gray-400/80 dark:to-gray-500/70 rounded-full animate-modal-line-out" />
          </div>
        )}

        {/* ── Modal card — clip-path animation ─────────────── */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.exportModal.title}
          className={[
            "flex flex-col w-full",
            "max-h-[95dvh] sm:max-h-[92vh]",
            "rounded-t-2xl sm:rounded-2xl",
            "bg-white dark:bg-[#08080b]",
            "border-t border-x sm:border border-gray-200 dark:border-gray-800",
            "shadow-2xl shadow-black/50 overflow-hidden",
            closing ? "animate-modal-collapse" : "animate-modal-expand"
          ].join(" ")}
        >
          <div className={["flex flex-col flex-1 min-h-0", closing ? "invisible" : "animate-modal-content"].join(" ")}>
            <div className="flex items-center px-5 py-3.5 border-b border-gray-200 dark:border-gray-800 shrink-0">
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
            </div>

            <div className="flex items-center border-b border-gray-200 dark:border-gray-800 shrink-0 overflow-x-auto">
              {FRAMEWORKS.map((fw) => {
                const isActive = activeFramework === fw.id
                return (
                  <button
                    key={fw.id}
                    onClick={() => setActiveFramework(fw.id)}
                    className={[
                      "flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider",
                      "whitespace-nowrap border-b-2 transition-colors cursor-pointer shrink-0",
                      isActive
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/30"
                        : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    ].join(" ")}
                  >
                    <Icon icon={FRAMEWORK_ICON[fw.id]} className="w-3.5 h-3.5 shrink-0" />
                    {fw.label}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-1 min-h-0 ">
              <ExportPanel
                svgData={svgData}
                animation={animation}
                duration={duration}
                theme={theme}
                code={code}
                filename={activeConfig.filename}
                onCopy={handleCopy}
                copied={copied}
              />
            </div>

            <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 px-4 py-3">
              {(exportingGif || exportingWebm) && (
                <div className="mb-3 flex flex-col gap-1.5">
                  {exportingGif && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-100"
                          style={{ width: `${gifProgress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 font-mono shrink-0">GIF {gifProgress}%</span>
                    </div>
                  )}
                  {exportingWebm && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all duration-100"
                          style={{ width: `${webmProgress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 font-mono shrink-0">WebM {webmProgress}%</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportAsGif}
                    disabled={busy}
                    className={[
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer",
                      busy
                        ? "opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800/40 dark:border-gray-700/50 dark:text-gray-500"
                        : "bg-white border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 dark:bg-gray-800/60 dark:border-gray-700/50 dark:text-gray-300 dark:hover:border-violet-500 dark:hover:text-violet-400 dark:hover:bg-violet-950/30"
                    ].join(" ")}
                  >
                    {exportingGif ? (
                      <div className="w-3.5 h-3.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon icon="lucide:image" className="w-3.5 h-3.5" />
                    )}
                    {t.exportModal.exportGif}
                  </button>

                  <button
                    onClick={exportAsWebm}
                    disabled={busy}
                    className={[
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer",
                      busy
                        ? "opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800/40 dark:border-gray-700/50 dark:text-gray-500"
                        : "bg-white border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 dark:bg-gray-800/60 dark:border-gray-700/50 dark:text-gray-300 dark:hover:border-violet-500 dark:hover:text-violet-400 dark:hover:bg-violet-950/30"
                    ].join(" ")}
                  >
                    {exportingWebm ? (
                      <div className="w-3.5 h-3.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon icon="lucide:video" className="w-3.5 h-3.5" />
                    )}
                    {t.exportModal.exportVideo}
                  </button>
                </div>

                {/* Code download */}
                <div className="flex items-center gap-2">
                  <a
                    href={downloadHref}
                    download={activeConfig.filename}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                  >
                    <Icon icon="lucide:download" className="w-3.5 h-3.5" />
                    {t.exportModal.download}
                  </a>

                  <span className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 select-none">
                    .{fileExt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
