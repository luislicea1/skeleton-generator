"use client"

import { Icon } from "@iconify/react"
import { useState } from "react"
import { useTranslation } from "../context/language-context"
import type { AnimationType, SvgData, Theme } from "../types/skeleton"
import { buildSkeletonSvgString } from "../utils/svgParser"
import CodeHighlight from "./code-highlight"

interface ExportPanelProps {
  svgData: SvgData
  animation: AnimationType
  duration: number
  theme: Theme
  code: string
  filename: string
  onCopy: () => void
  copied: boolean
}


const ANIMATION_LABEL: Record<string, string> = {
  "left-right": "Left → Right",
  "right-left": "Right → Left",
  "top-bottom": "Top → Bottom",
  "bottom-top": "Bottom → Top",
  diagonal: "Diagonal",
  radial: "Radial",
  pulse: "Pulse",
  wave: "Wave"
}

export default function ExportPanel({
  svgData,
  animation,
  duration,
  theme,
  code,
  filename,
  onCopy,
  copied
}: Readonly<ExportPanelProps>) {
  const t = useTranslation()
  const [svgCopied, setSvgCopied] = useState(false)

  const svgString = buildSkeletonSvgString(svgData, theme, animation, duration)

  function handleCopySvg() {
    navigator.clipboard.writeText(svgString).then(() => {
      setSvgCopied(true)
      setTimeout(() => setSvgCopied(false), 2000)
    })
  }

  const previewBg = theme === "dark" ? "bg-gray-900 border-gray-700/40" : "bg-white border-gray-200"

  return (
    <div className="flex w-full flex-1 min-h-0">
      {/* ── Left: preview + metadata ─────────────────────── */}
      <div className="w-60 shrink-0 flex flex-col gap-4 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
        {/* Skeleton preview — inline SVG (no async, no blob restrictions) */}
        <div className={`rounded-xl border ${previewBg} flex items-center justify-center p-4 min-h-36 overflow-hidden`}>
          <div
            dangerouslySetInnerHTML={{ __html: svgString }}
            className="[&>svg]:max-w-full [&>svg]:max-h-28 [&>svg]:w-auto [&>svg]:h-auto"
          />
        </div>

        {/* Metadata */}
        <div className="flex flex-col gap-1.5">
          <MetaRow label="Size" value={`${svgData.width} × ${svgData.height}`} />
          <MetaRow label="Theme" value={theme} />
          <MetaRow label="Anim" value={ANIMATION_LABEL[animation] ?? animation} />
          <MetaRow label="Duration" value={`${duration.toFixed(1)}s`} />
        </div>

        {/* Copy SVG raw */}
        <button
          onClick={handleCopySvg}
          className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60 cursor-pointer transition-colors"
        >
          {svgCopied ? (
            <>
              <Icon icon="lucide:check" className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-600 dark:text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Icon icon="lucide:clipboard-copy" className="w-3.5 h-3.5" />
              Copy SVG
            </>
          )}
        </button>
      </div>

      {/* ── Right: code ──────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        {/* Code toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{filename}</span>
          <button
            onClick={onCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60 cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Icon icon="lucide:check" className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-600 dark:text-green-400">{t.exportModal.copied}</span>
              </>
            ) : (
              <>
                <Icon icon="lucide:clipboard" className="w-3.5 h-3.5" />
                {t.exportModal.copy}
              </>
            )}
          </button>
        </div>

        {/* Code body */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4">
          <CodeHighlight
            code={code}
            language="typescript"
            theme={theme}
            showLineNumbers={true}
            showCopyButton={false}
            className="rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </div>
  )
}

function MetaRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">{label}</span>
      <span className="text-[11px] font-mono text-gray-700 dark:text-gray-300 truncate text-right">{value}</span>
    </div>
  )
}
