// "use client"

// import { useAppTheme } from "@/modules/skeleton/context/theme-context"
// import { useCallback, useEffect, useRef, useState } from "react"
// import PortalDivider from "./PortalDivider"
// import "./style.css"
// import Skeleton1 from "./skeletons/Skeleton1"
// import Skeleton2 from "./skeletons/Skeleton2"
// import Skeleton3 from "./skeletons/Skeleton3"
// import Skeleton4 from "./skeletons/Skeleton4"
// import Skeleton5 from "./skeletons/Skeleton5"
// import Skeleton6 from "./skeletons/Skeleton6"


// const SKELETON_MAP: Record<number, React.FC<{ isDark: boolean }>> = {
//   1: Skeleton1,
//   2: Skeleton2,
//   3: Skeleton3,
//   4: Skeleton4,
//   5: Skeleton5,
//   6: Skeleton6
// }

// interface SlideItem {
//   id: number
//   image: string
//   skeletonId: number
// }

// const SLIDES: SlideItem[] = [
//   { id: 1, image: "/landing/img1.webp", skeletonId: 1 },
//   { id: 2, image: "/landing/img2.webp", skeletonId: 2 },
//   { id: 3, image: "/landing/img3.webp", skeletonId: 3 },
//   { id: 4, image: "/landing/img4.webp", skeletonId: 4 },
//   { id: 5, image: "/landing/img5.webp", skeletonId: 5 },
// ]

// const LOOP_SETS = 6
// const LOOPED: SlideItem[] = Array.from({ length: LOOP_SETS }, (_, s) =>
//   SLIDES.map((sl) => ({ ...sl, id: sl.id + s * 1000 }))
// ).flat()

// const CARD_W = 300
// const CARD_H = 400
// const CARD_GAP = 28
// const CARD_STEP = CARD_W + CARD_GAP
// const SPEED = 0.5


// export default function SkeletonRevealCarousel() {
//   const { theme } = useAppTheme()
//   const isDark = theme === "dark"

//   const wrapperRef = useRef<HTMLDivElement>(null)
//   const offsetRef = useRef(0)
//   const rafRef = useRef<number>(0)
//   const pausedRef = useRef(false)
//   const [cards, setCards] = useState<{ x: number; item: SlideItem }[]>([])
//   const [lineX, setLineX] = useState(0)

//   const updateLineX = useCallback(() => {
//     if (!wrapperRef.current) return
//     setLineX(wrapperRef.current.getBoundingClientRect().width / 2)
//   }, [])

//   useEffect(() => {
//     updateLineX()
//     window.addEventListener("resize", updateLineX)
//     return () => window.removeEventListener("resize", updateLineX)
//   }, [updateLineX])

//   useEffect(() => {
//     const totalW = LOOPED.length * CARD_STEP
//     const oneSetW = SLIDES.length * CARD_STEP

//     function tick() {
//       if (!pausedRef.current) {
//         offsetRef.current += SPEED
//         if (offsetRef.current >= oneSetW) offsetRef.current -= oneSetW
//       }

//       setCards(
//         LOOPED.map((item, i) => {
//           let x = i * CARD_STEP - (totalW / 2) + offsetRef.current
//           while (x > totalW - CARD_STEP) x -= totalW
//           while (x < -CARD_W - CARD_GAP) x += totalW
//           return { x, item }
//         })
//       )

//       rafRef.current = requestAnimationFrame(tick)
//     }

//     rafRef.current = requestAnimationFrame(tick)
//     return () => cancelAnimationFrame(rafRef.current)
//   }, [])

//   return (
//     <section className="relative w-full overflow-hidden py-4">
//       <div
//         ref={wrapperRef}
//         className="relative w-full max-sm:h-[340px]"
//         style={{ height: `${CARD_H + 40}px` }}
//         onMouseEnter={() => (pausedRef.current = true)}
//         onMouseLeave={() => (pausedRef.current = false)}
//       >
//         {/* ── Portal Divider (replaces old inline divider) ── */}
//         <PortalDivider lineX={lineX} />

//         {/* ── Cards ── */}
//         <div className="absolute inset-0 z-10">
//           {cards.map(({ x, item }, idx) => {
//             const cardRight = x + CARD_W
//             const revealPx = Math.max(0, Math.min(CARD_W, cardRight - lineX))
//             const revealPct = (revealPx / CARD_W) * 100

//             const SkeletonComponent = SKELETON_MAP[item.skeletonId] || Skeleton1

//             return (
//               <div
//                 key={`${item.id}-${idx}`}
//                 className="absolute top-1/2 -translate-y-1/2"
//                 style={{ left: `${x}px`, width: `${CARD_W}px`, height: `${CARD_H}px` }}
//               >
//                 <div
//                   className={`relative w-full h-full rounded-2xl overflow-hidden border ${
//                     isDark ? "border-white/[0.06] bg-[#111118]" : "border-black/[0.05] bg-white"
//                   }`}
//                   style={{
//                     boxShadow: isDark ? "0 4px 32px rgba(0,0,0,0.5)" : "0 4px 32px rgba(0,0,0,0.07)",
//                   }}
//                 >
//                   <img
//                     src={item.image}
//                     alt=""
//                     className="absolute inset-0 w-full h-full object-cover object-top"
//                     draggable={false}
//                   />

//                   <div
//                     className={`absolute inset-0 ${isDark ? "bg-[#111118]" : "bg-[#f4f4f5]"} w-full h-full object-cover object-top`}
//                     style={{ clipPath: `inset(0 ${revealPct}% 0 0)` }}
//                   >
//                     <SkeletonComponent isDark={isDark} />
//                   </div>

//                   {revealPct > 2 && revealPct < 98 && (
//                     <div
//                       className="absolute top-0 bottom-0 w-[1px] z-10 pointer-events-none"
//                       style={{
//                         left: `${100 - revealPct}%`,
//                         transform: "translateX(-50%)",
//                         background: isDark
//                           ? "linear-gradient(180deg, transparent 5%, rgba(129,140,248,0.5) 50%, transparent 95%)"
//                           : "linear-gradient(180deg, transparent 5%, rgba(79,70,229,0.3) 50%, transparent 95%)",
//                       }}
//                     />
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </div>

//         <div
//           className={`absolute left-0 top-0 bottom-0 w-40 z-20 pointer-events-none ${
//             isDark ? "bg-linear-to-r from-[#08080b] to-transparent" : "bg-linear-to-r from-[#f8f8fc] to-transparent"
//           }`}
//         />
//         <div
//           className={`absolute right-0 top-0 bottom-0 w-40 z-20 pointer-events-none ${
//             isDark ? "bg-linear-to-l from-[#08080b] to-transparent" : "bg-linear-to-l from-[#f8f8fc] to-transparent"
//           }`}
//         />
//       </div>
//     </section>
//   )
// }

"use client"

import { useAppTheme } from "@/modules/skeleton/context/theme-context"
import { useCallback, useEffect, useRef, useState } from "react"
import PortalDivider from "./PortalDivider"
import "./style.css"
import Skeleton1 from "./skeletons/Skeleton1"
import Skeleton2 from "./skeletons/Skeleton2"
import Skeleton3 from "./skeletons/Skeleton3"
import Skeleton4 from "./skeletons/Skeleton4"
import Skeleton5 from "./skeletons/Skeleton5"
import Skeleton6 from "./skeletons/Skeleton6"

const SKELETON_MAP: Record<number, React.FC<{ isDark: boolean }>> = {
  1: Skeleton1,
  2: Skeleton2,
  3: Skeleton3,
  4: Skeleton4,
  5: Skeleton5,
  6: Skeleton6
}

interface SlideItem {
  id: number
  image: string
  skeletonId: number
}

const SLIDES: SlideItem[] = [
  { id: 1, image: "/landing/img1.webp", skeletonId: 1 },
  { id: 2, image: "/landing/img2.webp", skeletonId: 2 },
  { id: 3, image: "/landing/img3.webp", skeletonId: 3 },
  { id: 4, image: "/landing/img4.webp", skeletonId: 4 },
  { id: 5, image: "/landing/img5.webp", skeletonId: 5 },
]

const LOOP_SETS = 6
const LOOPED: SlideItem[] = Array.from({ length: LOOP_SETS }, (_, s) =>
  SLIDES.map((sl) => ({ ...sl, id: sl.id + s * 1000 }))
).flat()

// Ajustes de dimensiones
const CARD_W = 300
const CARD_GAP = 28
const CARD_STEP = CARD_W + CARD_GAP
const SPEED = 0.5
// Definimos el alto como una constante de CSS para usar en inline styles
const CARD_HEIGHT_DVH = "45dvh"

export default function SkeletonRevealCarousel() {
  const { theme } = useAppTheme()
  const isDark = theme === "dark"

  const wrapperRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const rafRef = useRef<number>(0)
  const pausedRef = useRef(false)
  const [cards, setCards] = useState<{ x: number; item: SlideItem }[]>([])
  const [lineX, setLineX] = useState(0)

  const updateLineX = useCallback(() => {
    if (!wrapperRef.current) return
    setLineX(wrapperRef.current.getBoundingClientRect().width / 2)
  }, [])

  useEffect(() => {
    updateLineX()
    window.addEventListener("resize", updateLineX)
    return () => window.removeEventListener("resize", updateLineX)
  }, [updateLineX])

  useEffect(() => {
    const totalW = LOOPED.length * CARD_STEP
    const oneSetW = SLIDES.length * CARD_STEP

    function tick() {
      if (!pausedRef.current) {
        offsetRef.current += SPEED
        if (offsetRef.current >= oneSetW) offsetRef.current -= oneSetW
      }

      setCards(
        LOOPED.map((item, i) => {
          let x = i * CARD_STEP - (totalW / 2) + offsetRef.current
          while (x > totalW - CARD_STEP) x -= totalW
          while (x < -CARD_W - CARD_GAP) x += totalW
          return { x, item }
        })
      )

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <section className="relative w-full overflow-hidden py-4">
      <div
        ref={wrapperRef}
        className="relative w-full flex items-center"
        // El contenedor mide un poco más que la card para dejar aire (30dvh + padding)
        style={{ height: `calc(${CARD_HEIGHT_DVH} + 40px)` }}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {/* ── Portal Divider ── */}
        <PortalDivider lineX={lineX} />

        {/* ── Cards Container ── */}
        <div className="absolute inset-0 z-10">
          {cards.map(({ x, item }, idx) => {
            const cardRight = x + CARD_W
            const revealPx = Math.max(0, Math.min(CARD_W, cardRight - lineX))
            const revealPct = (revealPx / CARD_W) * 100

            const SkeletonComponent = SKELETON_MAP[item.skeletonId] || Skeleton1

            return (
              <div
                key={`${item.id}-${idx}`}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ 
                  left: `${x}px`, 
                  width: `${CARD_W}px`, 
                  height: CARD_HEIGHT_DVH // Aplicación del 30% del alto visual
                }}
              >
                <div
                  className={`relative w-full h-full rounded-2xl overflow-hidden border ${
                    isDark ? "border-white/[0.06] bg-[#111118]" : "border-black/[0.05] bg-white"
                  }`}
                  style={{
                    boxShadow: isDark ? "0 4px 32px rgba(0,0,0,0.5)" : "0 4px 32px rgba(0,0,0,0.07)",
                  }}
                >
                  <img
                    src={item.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    draggable={false}
                  />

                  <div
                    className={`absolute inset-0 ${isDark ? "bg-[#111118]" : "bg-[#f4f4f5]"} w-full h-full`}
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

        {/* Degradados laterales adaptados al alto del contenedor */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-40 z-20 pointer-events-none ${
            isDark ? "bg-linear-to-r from-[#08080b] to-transparent" : "bg-linear-to-r from-[#f8f8fc] to-transparent"
          }`}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-40 z-20 pointer-events-none ${
            isDark ? "bg-linear-to-l from-[#08080b] to-transparent" : "bg-linear-to-l from-[#f8f8fc] to-transparent"
          }`}
        />
      </div>
    </section>
  )
}