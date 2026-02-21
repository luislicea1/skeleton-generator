"use client"
import { Icon } from "@iconify/react"
import { useState } from "react"
import { useTranslation } from "../context/language-context"
import { FRAMEWORKS, type AnimationType, type Framework, type SvgData, type Theme } from "../types/skeleton"
import { generateCode } from "../utils/generators"
import CodeBlock from "./CodeBlock"

interface ExportPanelProps {
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

export default function ExportPanel({ svgData, animation, duration, theme }: Readonly<ExportPanelProps>) {
  const t = useTranslation()
  const [activeFramework, setActiveFramework] = useState<Framework>("react")

  const activeConfig = FRAMEWORKS.find((f) => f.id === activeFramework)!
  const code = generateCode(activeFramework, svgData, theme, animation, duration)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {t.exportModal.framework}
        </p>
        <div className="flex flex-wrap gap-2">
          {FRAMEWORKS.map((fw) => (
            <button
              key={fw.id}
              onClick={() => setActiveFramework(fw.id)}
              className={[
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border",
                activeFramework === fw.id
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800/60 dark:border-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-700/60 dark:hover:text-gray-200"
              ].join(" ")}
            >
              <Icon icon={FRAMEWORK_ICON[fw.id]} className="w-4 h-4" />
              {fw.label}
            </button>
          ))}
        </div>
      </div>

      <CodeBlock code={code} filename={activeConfig.filename} />
    </div>
  )
}
