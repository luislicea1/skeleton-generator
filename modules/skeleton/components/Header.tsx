"use client"

import Logo from "@/assets/logo.png"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "../context/language-context"
import LanguageSelector from "./LanguageSelector"
import ThemeSwitch from "./ThemeSwitch"

export default function Header() {
  const t = useTranslation()

  return (
    <header className="border-b border-gray-200 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6  flex items-center justify-between gap-4">
        <div className="flex items-center gap-0 min-w-0 relative">
          <Link href="/">
            <Image src={Logo} alt="Logo" style={{ width: "120px", height: "80px" }} />
          </Link>
          <div className="min-w-0 absolute left-25">
            <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-none tracking-tight">
              {t.header.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageSelector />
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  )
}
