"use client"

import { useAppTheme } from "@/modules/skeleton/context/theme-context"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import "./landing.css"
import Header from "../skeleton/components/Header"
import SkeletonRevelCarrusel from "./components/SkeletonRevelCarrusel"
import type { SlideItem } from "./components/SkeletonRevelCarrusel"
import PortalDivider from "./components/PortalDivider"
import Skeleton1 from "./components/skeletons/Skeleton1"
import Skeleton2 from "./components/skeletons/Skeleton2"
import Skeleton3 from "./components/skeletons/Skeleton3"
import Skeleton4 from "./components/skeletons/Skeleton4"
import Skeleton5 from "./components/skeletons/Skeleton5"
import Skeleton6 from "./components/skeletons/Skeleton6"

const skeletonMap: Record<number, React.FC<{ isDark: boolean }>> = {
  1: Skeleton1,
  2: Skeleton2,
  3: Skeleton3,
  4: Skeleton4,
  5: Skeleton5,
  6: Skeleton6,
}

const SLIDES_ROW_1: SlideItem[] = [
  { id: 1, image: "/landing/img1.webp", skeletonId: 1 },
  { id: 2, image: "/landing/img2.webp", skeletonId: 2 },
  { id: 3, image: "/landing/img3.webp", skeletonId: 3 },
  { id: 4, image: "/landing/img4.webp", skeletonId: 4 },
  { id: 5, image: "/landing/img5.webp", skeletonId: 5 },
]

export default function LandingPage() {
  const { theme, toggleTheme } = useAppTheme()
  const isDark = theme === "dark"
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const carouselWrapperRef = useRef<HTMLDivElement>(null)
  const [portalLineX, setPortalLineX] = useState(0)

  const updatePortalLineX = useCallback(() => {
    if (!carouselWrapperRef.current) return
    const w = carouselWrapperRef.current.getBoundingClientRect().width
    if (w > 0) {
      setPortalLineX(w / 2)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    updatePortalLineX()
    const raf = requestAnimationFrame(() => {
      updatePortalLineX()
    })
    const timeout = setTimeout(() => {
      updatePortalLineX()
    }, 100)
    window.addEventListener("resize", updatePortalLineX)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
      window.removeEventListener("resize", updatePortalLineX)
    }
  }, [mounted, updatePortalLineX])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - r.left) / r.width - 0.5,
        y: (e.clientY - r.top) / r.height - 0.5,
      })
    }
    el.addEventListener("mousemove", onMove)
    return () => el.removeEventListener("mousemove", onMove)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`h-dvh overflow-hidden font-(family-name:--font-dm) ${
        isDark ? "bg-[#08080b] text-[#f4f4f5]" : "bg-[#f8f8fc] text-[#18181b]"
      }`}
    >
      {/* ── Animated background layer ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="landing-orb-1 absolute rounded-full blur-[120px]"
          style={{
            width: "500px",
            height: "500px",
            background: isDark
              ? "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)",
            top: "-10%",
            left: "-5%",
            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
            transition: "transform 0.6s ease-out",
          }}
        />
        <div
          className="landing-orb-2 absolute rounded-full blur-[100px]"
          style={{
            width: "400px",
            height: "400px",
            background: isDark
              ? "radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(217,70,239,0.06) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(217,70,239,0.04) 50%, transparent 70%)",
            top: "20%",
            right: "-8%",
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
            transition: "transform 0.6s ease-out",
          }}
        />
        <div
          className="landing-orb-3 absolute rounded-full blur-[140px]"
          style={{
            width: "600px",
            height: "600px",
            background: isDark
              ? "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(99,102,241,0.05) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.04) 50%, transparent 70%)",
            bottom: "-15%",
            left: "30%",
            transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
            transition: "transform 0.6s ease-out",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)"
              : "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {[...Array(12)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="landing-sparkle absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: isDark
                ? `rgba(${130 + (i * 10) % 60}, ${140 + (i * 8) % 50}, 248, ${0.4 + (i % 3) * 0.2})`
                : `rgba(${79 + (i * 8) % 40}, ${70 + (i * 6) % 40}, 229, ${0.3 + (i % 3) * 0.15})`,
              left: `${8 + (i * 7.5) % 84}%`,
              top: `${5 + (i * 13) % 85}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + (i % 4) * 1.5}s`,
              boxShadow: isDark
                ? `0 0 ${6 + i * 2}px rgba(129,140,248,0.6)`
                : `0 0 ${4 + i}px rgba(99,102,241,0.4)`,
            }}
          />
        ))}
      </div>

      {/* ── HEADER: altura fija 8dvh ── */}
      <div style={{ height: "8dvh", flexShrink: 0 }}>
        <Header />
      </div>

      {/* ── HERO: altura fija 42dvh, contenido centrado, overflow oculto ── */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center z-40 overflow-hidden"
        style={{ height: "42dvh" }}
      >
        <div className="flex flex-col items-center text-center gap-[1.2vh] px-6 max-w-180 w-full">
          <h1
            className={`font-(family-name:--font-syne) font-extrabold leading-[1.05] tracking-tight flex flex-col gap-0 ${
              isDark ? "text-[#f4f4f5]" : "text-[#18181b]"
            }`}
            style={{
              fontSize: "clamp(1.4rem, 5.8vh, 4.4rem)",
            }}
          >
            <span className="block landing-title-line-1">Crea Skeletons</span>
            <span className="block landing-title-line-2 relative">
              <span
                className="relative z-10 text-transparent"
                style={{
                  backgroundImage: isDark
                    ? "linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #c084fc 70%, #818cf8 100%)"
                    : "linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #8b5cf6 70%, #4f46e5 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  animation: "landing-gradient-shift 4s ease-in-out infinite",
                }}
              >
                animados,
              </span>
              <span
                className="absolute inset-0 blur-[30px] opacity-30 z-0"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg, #818cf8, #c084fc)"
                    : "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                }}
                aria-hidden
              />
            </span>
            <span className="block landing-title-line-3">en segundos.</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`landing-subtitle max-w-lg leading-relaxed ${
              isDark ? "text-[#a1a1aa]" : "text-[#71717a]"
            }`}
            style={{
              fontSize: "clamp(0.7rem, 1.7vh, 1rem)",
            }}
          >
            Genera skeleton loaders animados desde cualquier diseño.
            Copia el código y úsalo en tu proyecto.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center landing-buttons-enter">
            <Link
              href="/skeleton"
              className={`group relative inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-[0.95rem] transition-all duration-300 overflow-hidden ${
                isDark
                  ? "text-white hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(99,102,241,0.4)]"
                  : "text-white hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(79,70,229,0.25)]"
              }`}
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "linear-gradient(135deg, #4f46e5, #6366f1)",
              }}
            >
              <span className="absolute inset-0 landing-btn-shine" />
              <span className="relative z-10">Empezar gratis</span>
              <svg
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <a
              href="https://github.com/Frankwds/SkeletonGen"
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border text-[0.9rem] transition-all duration-300 ${
                isDark
                  ? "border-white/[0.08] text-[#a1a1aa] hover:border-indigo-400/40 hover:text-[#f4f4f5] hover:bg-indigo-500/8 hover:-translate-y-1"
                  : "border-black/[0.08] text-[#52525b] hover:border-indigo-500/30 hover:text-[#18181b] hover:bg-indigo-500/6 hover:-translate-y-1"
              }`}
            >
              <svg
                className="transition-transform duration-300 group-hover:rotate-[360deg]"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Ver en GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── CARRUSEL: altura fija 50dvh ── */}
      <div
        ref={carouselWrapperRef}
        className="relative overflow-hidden"
        style={{ height: "50dvh" }}
      >
        <div className="absolute inset-0 z-30 pointer-events-none">
          <PortalDivider lineX={portalLineX} />
        </div>

        <div className="relative h-full flex flex-col">
          <div className="flex-1 min-h-0">
            <SkeletonRevelCarrusel
              slides={SLIDES_ROW_1}
              skeletonMap={skeletonMap}
              lineX={portalLineX}
              speed={0.5}
            />
          </div>
        </div>

        <div
          className={`absolute inset-x-0 bottom-0 h-32 z-30 pointer-events-none ${
            isDark
              ? "bg-linear-to-b from-transparent to-[#08080b]"
              : "bg-linear-to-b from-transparent to-[#f8f8fc]"
          }`}
        />
      </div>
    </div>
  )
}