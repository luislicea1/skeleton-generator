"use client"
import { Icon } from "@iconify/react"
import { useState } from "react"
import ExportModal from "../components/ExportModal"
import Header from "../components/Header"
import LogoSkeleton from "../components/LogoSkeleton"
import PreviewPanel from "../components/PreviewPanel"
import Uploader from "../components/Uploader"
import { useTranslation } from "../context/language-context"
import { useAppTheme } from "../context/theme-context"
import type { AnimationType, SkeletonMode, SvgData, Theme } from "../types/skeleton"
import { DURATION_DEFAULT } from "../types/skeleton"

export default function SkeletonContainer() {
  const t = useTranslation()
  const { theme: appTheme } = useAppTheme()
  const skeletonTheme: Theme = appTheme === "dark" ? "dark" : "light"

  const [svgData, setSvgData] = useState<SvgData | null>(null)
  const [animation, setAnimation] = useState<AnimationType>("left-right")
  const [duration, setDuration] = useState(DURATION_DEFAULT)
  const [skeletonMode, setSkeletonMode] = useState<SkeletonMode>("precise")
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start h-[calc(100vh-82px)]  overflow-y-auto">

          {/* Left: upload + mode + image preview */}
          <div className="w-full lg:w-96 flex-none flex flex-col gap-3 py-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t.container.uploadTitle}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.container.uploadSubtitle}</p>
            </div>
            <Uploader mode={skeletonMode} onModeChange={setSkeletonMode} onLoad={setSvgData} />
          </div>

          {/* Vertical divider (desktop only) */}
          <div className="hidden lg:block w-px bg-gray-200 dark:bg-gray-800/60 self-stretch " />

          {/* Right: skeleton preview + export button */}
          <div className="flex-1 min-w-0 py-6 h-full">
            {svgData ? (
              <div className="flex flex-col gap-6">
                <PreviewPanel
                  svgData={svgData}
                  animation={animation}
                  duration={duration}
                  onAnimationChange={setAnimation}
                  onDurationChange={setDuration}
                />

                <button
                  onClick={() => setExportOpen(true)}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  <Icon icon="lucide:download" className="w-4 h-4" />
                  {t.exportModal.exportButton}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                <LogoSkeleton />
              </div>
            )}
          </div>
        </div>
      </main>
      {svgData && (
        <ExportModal
          isOpen={exportOpen}
          onClose={() => setExportOpen(false)}
          svgData={svgData}
          animation={animation}
          duration={duration}
          theme={skeletonTheme}
        />
      )}
    </div>
  )
}
