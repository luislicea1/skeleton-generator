import { NextRequest, NextResponse } from "next/server"
import { vectorize } from "@neplex/vectorizer"
import { Buffer } from "node:buffer"

interface PngToSvgOptions {
  colorPrecision?: number
  filterSpeckle?: number
  spliceThreshold?: number
  cornerThreshold?: number
  layerDifference?: number
  maxIterations?: number
}

const defaultOptions: Required<PngToSvgOptions> = {
  colorPrecision: 6,
  filterSpeckle: 4,
  spliceThreshold: 45,
  cornerThreshold: 60,
  layerDifference: 16,
  maxIterations: 4
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pngData = new Uint8Array(arrayBuffer)
    const buffer = Buffer.from(pngData)

    const svgText = await vectorize(buffer, {
      colorMode: 0,
      colorPrecision: defaultOptions.colorPrecision,
      filterSpeckle: defaultOptions.filterSpeckle,
      spliceThreshold: defaultOptions.spliceThreshold,
      cornerThreshold: defaultOptions.cornerThreshold,
      hierarchical: 0,
      mode: 2,
      layerDifference: defaultOptions.layerDifference,
      lengthThreshold: 0,
      maxIterations: defaultOptions.maxIterations,
    })

    return NextResponse.json({ svg: svgText })
  } catch (error) {
    console.error("Error converting PNG to SVG:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to convert PNG to SVG" },
      { status: 500 }
    )
  }
}
