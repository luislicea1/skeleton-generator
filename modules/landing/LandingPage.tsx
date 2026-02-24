"use client"

import LogoImg from "@/assets/logo.png"
import { useAppTheme } from "@/modules/skeleton/context/theme-context"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import "./landing.css"
import Header from "../skeleton/components/Header"
import SkeletonRevelCarrusel from "./components/SkeletonRevelCarrusel"


export default function LandingPage() {
  const { theme, toggleTheme } = useAppTheme()
  const isDark = theme === "dark"
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
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
      className={`min-h-screen overflow-x-hidden font-(family-name:--font-dm) ${isDark ? "bg-[#08080b] text-[#f4f4f5]" : "bg-[#f8f8fc] text-[#18181b]"
        }`}
    >
      <Header />

      <section ref={heroRef} className="relative max-h-[calc(100dvh-5rem-45dvh)] overflow-y-hidden pt-16 flex flex-col items-center">
        <div className="relative z-40 flex flex-col items-center text-center gap-5 px-6 max-w-180 w-full">
          <h1 className={`font-(family-name:--font-syne) font-extrabold text-[clamp(2.8rem,5.5vw,4.4rem)] leading-tight tracking-tight flex flex-col gap-0 ${isDark ? "text-[#f4f4f5]" : "text-[#18181b]"}`}>
            <span className="block fade-up-2a">Crea Skeletons</span>
            <span className={`block fade-up-2b ${isDark ? "text-[#818cf8]" : "text-[#4f46e5]"}`}>animados,</span>
            <span className="block fade-up-2c">en segundos.</span>
          </h1>

          <div className="flex items-center gap-2.5 flex-wrap justify-center fade-up-4">
            <Link
              href="/skeleton"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-medium text-[0.95rem] transition-all duration-200 ${isDark
                ? "bg-[#6366f1] text-white hover:bg-[#818cf8] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(99,102,241,0.32)]"
                : "bg-[#4f46e5] text-white hover:bg-[#6366f1] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(79,70,229,0.18)]"
                }`}
            >
              <span>Empezar gratis</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <a
              href="https://github.com/Frankwds/SkeletonGen"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-5 py-2.75 rounded-[10px] border text-[0.9rem] transition-all duration-200 ${isDark
                ? "border-white/[0.07] text-[#a1a1aa] hover:border-indigo-500/50 hover:text-[#f4f4f5] hover:bg-indigo-500/7 hover:-translate-y-0.5"
                : "border-black/[0.07] text-[#52525b] hover:border-indigo-500/40 hover:text-[#18181b] hover:bg-indigo-500/7 hover:-translate-y-0.5"
                }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Ver en GitHub
            </a>
          </div>
        </div>
      </section>
      <div className="absolute z-10 w-full mt-auto bottom-0 ">
        <SkeletonRevelCarrusel />
        {/* <SkeletonRevelCarrusel /> */}
      </div>

      <div
        className={`absolute inset-0 z-30 pointer-events-none ${isDark
          ? "bg-linear-to-b from-transparent via-transparent to-[#08080b]"
          : "bg-linear-to-b from-transparent via-transparent to-[#f8f8fc]"
          }`}
      />
    </div>
  )
}

