"use client"
import { useState } from "react"
import type { AnimationType, SvgData, Theme } from "../types/skeleton"
import { buildFrameSvg, renderSvgToCanvas } from "../utils/frameRenderer"

const GIF_FPS = 60
const WEBM_FPS = 60
const MAX_DIM = 600

interface UseAnimationExportOptions {
  svgData: SvgData
  animation: AnimationType
  theme: Theme
  duration: number
}

export interface UseAnimationExportReturn {
  exportingGif: boolean
  exportingWebm: boolean
  gifProgress: number
  webmProgress: number
  exportAsGif: () => Promise<void>
  exportAsWebm: () => Promise<void>
}

function getExportDimensions(width: number, height: number): { w: number; h: number } {
  const scale = Math.min(1, MAX_DIM / Math.max(width, height))
  return { w: Math.round(width * scale), h: Math.round(height * scale) }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function useAnimationExport({
  svgData,
  animation,
  theme,
  duration
}: UseAnimationExportOptions): UseAnimationExportReturn {
  const [exportingGif, setExportingGif] = useState(false)
  const [exportingWebm, setExportingWebm] = useState(false)
  const [gifProgress, setGifProgress] = useState(0)
  const [webmProgress, setWebmProgress] = useState(0)

  async function exportAsGif() {
    setExportingGif(true)
    setGifProgress(0)
    try {
      const { GIFEncoder, quantize, applyPalette } = await import("gifenc")

      const svgW = parseFloat(svgData.width)
      const svgH = parseFloat(svgData.height)
      const { w, h } = getExportDimensions(svgW, svgH)

      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")!

      const totalFrames = Math.ceil(GIF_FPS * duration)
      const delayMs = Math.round(100 / GIF_FPS) // centiseconds per frame

      const encoder = GIFEncoder()

      for (let i = 0; i < totalFrames; i++) {
        const progress = i / totalFrames
        const frameSvg = buildFrameSvg(svgData, animation, theme, progress)
        await renderSvgToCanvas(frameSvg, canvas)

        const imageData = ctx.getImageData(0, 0, w, h)
        const rgba = new Uint8ClampedArray(imageData.data)

        const palette = quantize(rgba, 256)
        const index = applyPalette(rgba, palette)

        encoder.writeFrame(index, w, h, {
          palette,
          delay: delayMs,
          repeat: 0
        })

        setGifProgress(Math.round(((i + 1) / totalFrames) * 100))
      }

      encoder.finish()
      const blob = new Blob([new Uint8Array(encoder.bytesView())], { type: "image/gif" })
      triggerDownload(blob, `skeleton-${animation}.gif`)
    } finally {
      setExportingGif(false)
      setGifProgress(0)
    }
  }

  async function exportAsWebm() {
    setExportingWebm(true)
    setWebmProgress(0)
    try {
      const svgW = parseFloat(svgData.width)
      const svgH = parseFloat(svgData.height)
      const { w, h } = getExportDimensions(svgW, svgH)

      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm"

      const stream = canvas.captureStream(WEBM_FPS)
      const recorder = new MediaRecorder(stream, { mimeType })
      const chunks: BlobPart[] = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      recorder.start()

      const totalFrames = Math.ceil(WEBM_FPS * duration)
      const frameInterval = (duration * 1000) / totalFrames

      for (let i = 0; i < totalFrames; i++) {
        const progress = i / totalFrames
        const frameSvg = buildFrameSvg(svgData, animation, theme, progress)
        await renderSvgToCanvas(frameSvg, canvas)
        await new Promise<void>((resolve) => setTimeout(resolve, frameInterval))
        setWebmProgress(Math.round(((i + 1) / totalFrames) * 100))
      }

      recorder.stop()

      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve()
      })

      const blob = new Blob(chunks, { type: mimeType })
      triggerDownload(blob, `skeleton-${animation}.webm`)
    } finally {
      setExportingWebm(false)
      setWebmProgress(0)
    }
  }

  return { exportingGif, exportingWebm, gifProgress, webmProgress, exportAsGif, exportAsWebm }
}
