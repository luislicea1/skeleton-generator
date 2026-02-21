"use client"

import { Icon } from "@iconify/react"
import type { Translations } from "../i18n/types"
import type { AnimationType } from "../types/skeleton"

interface AnimationPickerProps {
  animation: AnimationType
  duration: number
  onAnimationChange: (a: AnimationType) => void
  t: Translations["animations"]
}

const ANIM_META: Record<AnimationType, { icon: string; cssClass: string }> = {
  "left-right": { icon: "lucide:arrow-right", cssClass: "sk-prev-ltr" },
  "right-left": { icon: "lucide:arrow-left", cssClass: "sk-prev-rtl" },
  "top-bottom": { icon: "lucide:arrow-down", cssClass: "sk-prev-ttb" },
  "bottom-top": { icon: "lucide:arrow-up", cssClass: "sk-prev-btt" },
  diagonal: { icon: "lucide:arrow-up-right", cssClass: "sk-prev-diag" },
  radial: { icon: "lucide:sparkles", cssClass: "sk-prev-radial" },
  pulse: { icon: "lucide:activity", cssClass: "sk-prev-pulse" },
  wave: { icon: "lucide:waves", cssClass: "sk-prev-wave" }
}

const ANIM_ORDER: AnimationType[] = [
  "left-right",
  "right-left",
  "top-bottom",
  "bottom-top",
  "diagonal",
  "radial",
  "pulse",
  "wave"
]

export default function AnimationPicker({ animation, duration, onAnimationChange, t }: Readonly<AnimationPickerProps>) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {ANIM_ORDER.map((id) => {
        const { icon, cssClass } = ANIM_META[id]
        const isActive = animation === id

        return (
          <button
            key={id}
            onClick={() => onAnimationChange(id)}
            title={t[id]}
            className={[
              "group flex flex-col gap-1.5 p-1.5 rounded-xl border cursor-pointer",
              isActive
                ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40"
                : "border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/40"
            ].join(" ")}
          >
            <div
              className={`sk-shimmer ${cssClass} w-full h-10 rounded-lg bg-gray-200 dark:bg-gray-700`}
              style={{ "--sk-dur": `${duration}s` } as React.CSSProperties}
            />

            <div className="flex items-center gap-1 px-0.5">
              <Icon
                icon={icon}
                className={[
                  "w-3 h-3 shrink-0",
                  isActive ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"
                ].join(" ")}
              />
              <span
                className={[
                  "text-[10px] font-medium leading-tight truncate",
                  isActive ? "text-indigo-600 dark:text-indigo-300" : "text-gray-500 dark:text-gray-400"
                ].join(" ")}
              >
                {t[id]}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
