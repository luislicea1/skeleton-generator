"use client"

import { useAppTheme } from "@/modules/skeleton/context/theme-context"
import { useEffect, useMemo, useRef, useState } from "react"
import "./style.css"

export interface SlideItem {
  id: number
  image: string
  skeletonId: number
}

interface Props {
  slides: SlideItem[]
  skeletonMap: Record<number, React.FC<{ isDark: boolean }>>
  lineX: number
  speed?: number
}

const LOOP_SETS = 6
const CARD_W = 300
const CARD_GAP = 28
const CARD_STEP = CARD_W + CARD_GAP

export default function SkeletonRevealCarousel({
  slides,
  skeletonMap,
  lineX,
  speed = 0.5,
}: Props) {
  const { theme } = useAppTheme()
  const isDark = theme === "dark"

  const looped = useMemo(
    () =>
      Array.from({ length: LOOP_SETS }, (_, s) =>
        slides.map((sl) => ({ ...sl, id: sl.id + s * 1000 }))
      ).flat(),
    [slides]
  )

  const FallbackSkeleton = useMemo(() => {
    const keys = Object.keys(skeletonMap)
    return keys.length > 0 ? skeletonMap[Number(keys[0])] : () => null
  }, [skeletonMap])

  const offsetRef = useRef(0)
  const rafRef = useRef<number>(0)
  const pausedRef = useRef(false)
  const [cards, setCards] = useState<{ x: number; item: SlideItem }[]>([])

  // Use window center as fallback when lineX hasn't been calculated yet
  const effectiveLineX = lineX > 0 ? lineX : (typeof window !== "undefined" ? window.innerWidth / 2 : 0)

  useEffect(() => {
    const totalW = looped.length * CARD_STEP
    const oneSetW = slides.length * CARD_STEP

    function tick() {
      if (!pausedRef.current) {
        offsetRef.current += speed
        if (speed > 0 && offsetRef.current >= oneSetW)
          offsetRef.current -= oneSetW
        if (speed < 0 && offsetRef.current <= -oneSetW)
          offsetRef.current += oneSetW
      }

      setCards(
        looped.map((item, i) => {
          let x = i * CARD_STEP - totalW / 2 + offsetRef.current
          while (x > totalW - CARD_STEP) x -= totalW
          while (x < -CARD_W - CARD_GAP) x += totalW
          return { x, item }
        })
      )

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [looped, slides.length, speed])

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-transparent"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="absolute inset-0 z-10">
        {cards.map(({ x, item }, idx) => {
          const cardRight = x + CARD_W
          const revealPx = Math.max(0, Math.min(CARD_W, cardRight - effectiveLineX))
          const revealPct = (revealPx / CARD_W) * 100

          const SkeletonComponent =
            skeletonMap[item.skeletonId] || FallbackSkeleton

          return (
            <div
              key={`${item.id}-${idx}`}
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: `${x}px`,
                width: `${CARD_W}px`,
                height: "85%",
              }}
            >
              <div
                className={`relative w-full h-full rounded-2xl overflow-hidden border ${
                  isDark
                    ? "border-white/[0.06] bg-[#111118]"
                    : "border-black/[0.05] bg-white"
                }`}
                style={{
                  boxShadow: isDark
                    ? "0 4px 32px rgba(0,0,0,0.5)"
                    : "0 4px 32px rgba(0,0,0,0.07)",
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  draggable={false}
                />

                <div
                  className={`absolute inset-0 ${
                    isDark ? "bg-[#111118]" : "bg-[#f4f4f5]"
                  } w-full h-full`}
                  style={{ clipPath: `inset(0 ${revealPct}% 0 0)` }}
                >
                  <SkeletonComponent isDark={isDark} />
                </div>

                {revealPct > 2 && revealPct < 98 && (
                  <div
                    className="absolute top-0 bottom-0 w-[1px] z-10 pointer-events-none"
                    style={{
                      left: `${100 - revealPct}%`,
                      transform: "translateX(-50%)",
                      background: isDark
                        ? "linear-gradient(180deg, transparent 5%, rgba(129,140,248,0.5) 50%, transparent 95%)"
                        : "linear-gradient(180deg, transparent 5%, rgba(79,70,229,0.3) 50%, transparent 95%)",
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Side fades */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-40 z-20 pointer-events-none ${
          isDark
            ? "bg-linear-to-r from-[#08080b] to-transparent"
            : "bg-linear-to-r from-[#f8f8fc] to-transparent"
        }`}
      />
      <div
        className={`absolute right-0 top-0 bottom-0 w-40 z-20 pointer-events-none ${
          isDark
            ? "bg-linear-to-l from-[#08080b] to-transparent"
            : "bg-linear-to-l from-[#f8f8fc] to-transparent"
        }`}
      />
    </div>
  )
}