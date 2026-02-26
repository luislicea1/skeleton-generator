"use client"
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react"
import { useTranslation } from "../context/language-context"
import type { SkeletonMode, SvgData } from "../types/skeleton"
import { parseSvgContour, parseSvgPrecise } from "../utils/svgParser"

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function isRasterImage(file: File): boolean {
  const rasterTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
  const rasterExts = [".png", ".jpg", ".jpeg", ".webp"]
  return rasterTypes.includes(file.type) || rasterExts.some((ext) => file.name.toLowerCase().endsWith(ext))
}

async function convertToPng(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error("Canvas not available"))
        return
      }
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error("Failed to convert image to PNG")); return }
        const pngName = file.name.replace(/\.[^/.]+$/, ".png")
        resolve(new File([blob], pngName, { type: "image/png" }))
      }, "image/png")
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")) }
    img.src = url
  })
}

interface UseUploaderOptions {
  mode: SkeletonMode
  onLoad: (data: SvgData) => void
}

export interface UseUploaderReturn {
  inputRef: React.RefObject<HTMLInputElement | null>
  isDragging: boolean
  error: string | null
  filename: string | null
  imageUrl: string | null
  processing: boolean
  sizeInfo: { original: number; skeleton: number } | null
  reduction: number | null
  handleDrop: (e: DragEvent<HTMLDivElement>) => void
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void
  handleDragLeave: () => void
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function useUploader({ mode, onLoad }: UseUploaderOptions): UseUploaderReturn {
  const t = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [sizeInfo, setSizeInfo] = useState<{ original: number; skeleton: number } | null>(null)
  const [rawSvgText, setRawSvgText] = useState<string | null>(null)

  useEffect(() => {
    if (rawSvgText) runParse(rawSvgText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  async function runParse(text: string) {
    setError(null)
    setSizeInfo(null)
    setProcessing(true)
    try {
      const originalSize = new Blob([text]).size
      const data = mode === "silhouette" ? await parseSvgContour(text) : parseSvgPrecise(text)
      const skeletonSize = new Blob([data.skeletonBody]).size
      setSizeInfo({ original: originalSize, skeleton: skeletonSize })
      onLoad(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.uploader.errorOnlySvg)
    } finally {
      setProcessing(false)
    }
  }

  async function processFile(file: File) {
    setError(null)
    setSizeInfo(null)
    const isRaster = isRasterImage(file)
    const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")

    if (!isRaster && !isSvg) {
      setError(t.uploader.errorOnlyPngOrSvg)
      return
    }

    setProcessing(true)

    try {
      let svgText: string
      let displayName = file.name

      if (isRaster) {
        const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png")
        const pngFile = isPng ? file : await convertToPng(file)

        const formData = new FormData()
        formData.append("file", pngFile)

        const response = await fetch("/api/png-to-svg", {
          method: "POST",
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to convert PNG to SVG")
        }

        const data = await response.json()
        svgText = data.svg
        displayName = file.name.replace(/\.[^/.]+$/, ".svg")
      } else {
        svgText = await file.text()
      }

      setRawSvgText(svgText)
      const blob = new Blob([svgText], { type: "image/svg+xml" })
      setImageUrl(URL.createObjectURL(blob))
      setFilename(displayName)
      await runParse(svgText)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.uploader.errorOnlyPngOrSvg)
      setProcessing(false)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ""
  }

  const reduction = sizeInfo ? Math.max(0, Math.round((1 - sizeInfo.skeleton / sizeInfo.original) * 100)) : null

  return {
    inputRef,
    isDragging,
    error,
    filename,
    imageUrl,
    processing,
    sizeInfo,
    reduction,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleChange,
  }
}
