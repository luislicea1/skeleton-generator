"use client"

import { useAppTheme } from "@/modules/skeleton/context/theme-context"
import "./portaldivider.css"

interface PortalDividerProps {
  lineX: number
}

export default function PortalDivider({ lineX }: PortalDividerProps) {
  const { theme } = useAppTheme()
  const isDark = theme === "dark"

  return (
    <div
      className="absolute top-0 bottom-0 z-30 pointer-events-none"
      style={{ left: `${lineX}px`, width: "1px" }}
    >
      {/* ── Outer ambient glow ── */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[120px] portal-ambient-pulse"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, rgba(129,140,248,0.08) 0%, transparent 70%)"
            : "radial-gradient(ellipse at center, rgba(79,70,229,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Wide soft glow ── */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[60px]"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, rgba(129,140,248,0.12) 0%, transparent 80%)"
            : "radial-gradient(ellipse at center, rgba(79,70,229,0.08) 0%, transparent 80%)",
        }}
      />

      {/* ── Core beam ── */}
      <div
        className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] ${
          isDark ? "bg-[#818cf8]" : "bg-[#4f46e5]"
        }`}
        style={{
          boxShadow: isDark
            ? "0 0 8px rgba(129,140,248,0.8), 0 0 24px rgba(129,140,248,0.4), 0 0 60px rgba(129,140,248,0.15)"
            : "0 0 8px rgba(79,70,229,0.6), 0 0 24px rgba(79,70,229,0.3), 0 0 60px rgba(79,70,229,0.1)",
        }}
      />

      {/* ── Secondary thinner beams (flanking) ── */}
      <div
        className="absolute top-0 bottom-0 left-1/2 w-[1px] portal-flank-left"
        style={{
          transform: "translateX(calc(-50% - 4px))",
          background: isDark
            ? "linear-gradient(180deg, transparent 0%, rgba(129,140,248,0.25) 20%, rgba(167,139,250,0.3) 50%, rgba(129,140,248,0.25) 80%, transparent 100%)"
            : "linear-gradient(180deg, transparent 0%, rgba(79,70,229,0.15) 20%, rgba(99,102,241,0.2) 50%, rgba(79,70,229,0.15) 80%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-0 bottom-0 left-1/2 w-[1px] portal-flank-right"
        style={{
          transform: "translateX(calc(-50% + 4px))",
          background: isDark
            ? "linear-gradient(180deg, transparent 0%, rgba(129,140,248,0.25) 20%, rgba(167,139,250,0.3) 50%, rgba(129,140,248,0.25) 80%, transparent 100%)"
            : "linear-gradient(180deg, transparent 0%, rgba(79,70,229,0.15) 20%, rgba(99,102,241,0.2) 50%, rgba(79,70,229,0.15) 80%, transparent 100%)",
        }}
      />

      {/* ── Scanning beam (moves up and down) ── */}
      <div className="absolute left-1/2 -translate-x-1/2 portal-scanner">
        <div
          className="w-[40px] h-[3px] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at center, rgba(167,139,250,0.9) 0%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(99,102,241,0.7) 0%, transparent 70%)",
            boxShadow: isDark
              ? "0 0 12px rgba(167,139,250,0.6), 0 0 30px rgba(129,140,248,0.3)"
              : "0 0 12px rgba(99,102,241,0.4), 0 0 30px rgba(79,70,229,0.2)",
          }}
        />
      </div>

      {/* ── Second scanner (offset timing) ── */}
      <div className="absolute left-1/2 -translate-x-1/2 portal-scanner-reverse">
        <div
          className="w-[28px] h-[2px] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at center, rgba(129,140,248,0.7) 0%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(79,70,229,0.5) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Energy particles floating up ── */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute left-1/2 portal-particle"
          style={{
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${2.5 + (i % 3) * 0.5}s`,
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: isDark ? "#a78bfa" : "#6366f1",
              boxShadow: isDark
                ? `0 0 ${4 + i * 2}px rgba(167,139,250,0.8)`
                : `0 0 ${4 + i * 2}px rgba(99,102,241,0.6)`,
            }}
          />
        </div>
      ))}

      {/* ── Center diamond icon ── */}
      <div className="absolute top-1/2 left-2.5 -translate-x-1/2 -translate-y-1/2 portal-center-spin">
        <div
          className={`w-5 h-5 rotate-45 left-2 top-1 rounded-sm ${isDark ? "bg-[#818cf8]/20 border border-[#818cf8]/40" : "bg-[#4f46e5]/15 border border-[#4f46e5]/30"}`}
          style={{
            backdropFilter: "blur(4px)",
            boxShadow: isDark
              ? "0 0 12px rgba(129,140,248,0.3), inset 0 0 8px rgba(129,140,248,0.1)"
              : "0 0 12px rgba(79,70,229,0.2), inset 0 0 8px rgba(79,70,229,0.05)",
          }}
        >
          <div
            className={`absolute inset-[3px] rounded-[2px] ${isDark ? "bg-[#818cf8]/40" : "bg-[#4f46e5]/25"}`}
          />
        </div>
      </div>

      {/* ── Horizontal energy ripples at center ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="portal-ripple-1 rounded-full"
          style={{
            width: "40px",
            height: "40px",
            border: isDark ? "1px solid rgba(129,140,248,0.15)" : "1px solid rgba(79,70,229,0.1)",
          }}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="portal-ripple-2 rounded-full"
          style={{
            width: "40px",
            height: "40px",
            border: isDark ? "1px solid rgba(129,140,248,0.1)" : "1px solid rgba(79,70,229,0.07)",
          }}
        />
      </div>
    </div>
  )
}