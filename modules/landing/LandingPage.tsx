"use client"

import LogoImg from "@/assets/logo.png"
import { useAppTheme } from "@/modules/skeleton/context/theme-context"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import "./landing.css"

const CARDS = [
  { id: 1, src: "/landing/img1.svg", srcBack: "/landing/img4.svg" },
  { id: 2, src: "/landing/img2.svg", srcBack: "/landing/img5.svg" },
  { id: 3, src: "/landing/img3.svg", srcBack: "/landing/img1.svg" }
]

const FRAMEWORKS = ["React", "Angular", "Vue", "React Native", "Flutter"]

export default function LandingPage() {
  const { theme, toggleTheme } = useAppTheme()
  const isDark = theme === "dark"
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [fwIndex, setFwIndex] = useState(0)
  const [fwVisible, setFwVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function advanceFw() {
      setFwIndex((n) => (n + 1) % FRAMEWORKS.length)
      setFwVisible(true)
    }
    const iv = setInterval(() => {
      setFwVisible(false)
      setTimeout(advanceFw, 320)
    }, 2200)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      setMousePos({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 })
    }
    el.addEventListener("mousemove", onMove)
    return () => el.removeEventListener("mousemove", onMove)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`h-screen overflow-hidden font-[family-name:var(--font-dm)] ${isDark ? "bg-[#08080b] text-[#f4f4f5]" : "bg-[#f8f8fc] text-[#18181b]"}`}
    >
      {/* Nav */}
      <nav className={isDark ? "nav-glass" : "nav-glass-light"}>
        <div className="nav-inner">
          <div className="flex items-center gap-2.5">
            <Image src={LogoImg} alt="Skeleton Generator" width={40} height={40} priority className="object-contain" />
            <span
              className={`font-[family-name:var(--font-syne)] font-extrabold text-[1.05rem] tracking-tight ${isDark ? "text-[#f4f4f5]" : "text-[#18181b]"}`}
            >
              Skeleton<em className={isDark ? "text-[#818cf8]" : "text-[#4f46e5]"}>Gen</em>
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 ${isDark ? "border-white/[0.07] text-[#a1a1aa] hover:bg-indigo-500/10 hover:text-[#818cf8] hover:border-indigo-500/50" : "border-black/[0.07] text-[#52525b] hover:bg-indigo-500/10 hover:text-[#4f46e5] hover:border-indigo-500/40"}`}
            aria-label={isDark ? "Modo claro" : "Modo oscuro"}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className={`relative h-screen pt-16 flex flex-col items-center overflow-hidden`}>
        {/* Grid */}
        <div className={`absolute inset-0 pointer-events-none z-0 ${isDark ? "hero-grid" : "hero-grid-light"}`} />

        {/* Glows */}
        <div
          className="absolute w-[800px] h-[600px] rounded-full pointer-events-none z-0 -top-24 left-1/2 -translate-x-1/2 bg-indigo-500/10 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * 50}px), ${mousePos.y * 40}px)`,
            filter: "blur(70px)"
          }}
        />
        <div
          className="absolute w-[500px] h-[400px] rounded-full pointer-events-none z-0 top-[30%] left-[60%] bg-violet-400/10 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(calc(-60% + ${-mousePos.x * 30}px), ${-mousePos.y * 25}px)`,
            filter: "blur(70px)"
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center gap-5 pt-13 px-6 max-w-[720px] w-full">
          <h1
            className={`font-[family-name:var(--font-syne)] font-extrabold text-[clamp(2.8rem,5.5vw,4.4rem)] leading-tight tracking-tight flex flex-col gap-0 ${isDark ? "text-[#f4f4f5]" : "text-[#18181b]"}`}
          >
            <span className="block fade-up-2a">Skeletons</span>
            <span className={`block fade-up-2b ${isDark ? "text-[#818cf8]" : "text-[#4f46e5]"}`}>animados,</span>
            <span className="block fade-up-2c">en segundos.</span>
          </h1>

          {/* Desc */}
          <p
            className={`text-base leading-[1.7] font-light max-w-[520px] fade-up-3 ${isDark ? "text-[#a1a1aa]" : "text-[#52525b]"}`}
          >
            Automatiza la creación de tus pantallas de carga. Sube un SVG y obtén código optimizado y listo para usar
            con el framework de tu preferencia. Sin librerías extra.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center fade-up-4">
            <Link
              href="/skeleton"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-medium text-[0.95rem] transition-all duration-200 ${isDark ? "bg-[#6366f1] text-white hover:bg-[#818cf8] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(99,102,241,0.32)]" : "bg-[#4f46e5] text-white hover:bg-[#6366f1] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(79,70,229,0.18)]"}`}
            >
              <span>Empezar gratis</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://github.com/Frankwds/SkeletonGen"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-5 py-[11px] rounded-[10px] border text-[0.9rem] transition-all duration-200 ${isDark ? "border-white/[0.07] text-[#a1a1aa] hover:border-indigo-500/50 hover:text-[#f4f4f5] hover:bg-indigo-500/7 hover:-translate-y-0.5" : "border-black/[0.07] text-[#52525b] hover:border-indigo-500/40 hover:text-[#18181b] hover:bg-indigo-500/7 hover:-translate-y-0.5"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Ver en GitHub
            </a>
          </div>

          {/* Frameworks */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center fade-up-5">
            {FRAMEWORKS.map((fw) => (
              <span
                key={fw}
                className={`px-3 py-0.5 rounded-full border text-[0.72rem] tracking-wide transition-all duration-200 ${isDark ? "border-white/[0.07] text-[#52525b] hover:border-[#818cf8] hover:text-[#818cf8]" : "border-black/[0.07] text-[#a1a1aa] hover:border-[#4f46e5] hover:text-[#4f46e5]"}`}
              >
                {fw}
              </span>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="absolute bottom-[-80px] left-0 right-0 w-full h-[520px] z-10 flex justify-center items-end max-md:bottom-[-60px] max-md:h-[460px] max-sm:bottom-[-40px] max-sm:h-[340px]">
          {CARDS.map((card, i) => (
            <button
              key={card.id}
              type="button"
              className={`flip-card group w-80 h-[420px] outline-none cursor-pointer mx-[-40px] max-md:w-[260px] max-md:h-[360px] max-md:mx-[-30px] max-sm:w-[180px] max-sm:h-[260px] max-sm:mx-[-20px]`}
              style={{ zIndex: 5 - Math.abs(i - 1) }}
            >
              <div className="flip-card-inner">
                {/* Front */}
                <div
                  className={`flip-card-front ${isDark ? "bg-[#111118] border-white/[0.07]" : "bg-white border-black/[0.07]"} ${i === 0 || i === 2 ? "card-shadow-side" : "card-shadow-center"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    alt={card.id.toString()}
                    className="w-full h-[350px] object-cover object-top max-md:h-[300px] max-sm:h-[210px]"
                    loading={i === 1 ? "eager" : "lazy"}
                  />
                </div>
                {/* Back */}
                <div
                  className={`flip-card-back ${isDark ? "bg-[#111118] border-white/[0.07]" : "bg-white border-black/[0.07]"} ${i === 0 || i === 2 ? "card-shadow-side" : "card-shadow-center"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.srcBack}
                    alt={`${card.id} preview`}
                    className="w-full h-[350px] object-cover object-top max-md:h-[300px] max-sm:h-[210px]"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
