import type { Translations } from "./types"

const en: Translations = {
  header: {
    title: "Skeleton Generator",
    badge: "React · Angular · Vue · Flutter"
  },
  uploader: {
    title: "PNG, JPG, WebP or SVG Image",
    subtitle: "Upload an image file to generate its skeleton.",
    algorithm: "Algorithm",
    modePrecise: "Precise",
    modePreciseDesc: "Preserves the original shapes. Ideal for logos and simple icons.",
    modeSilhouette: "Silhouette",
    modeSilhouetteDesc: "Extracts only the outer contour with smooth curves. Ideal for complex images.",
    dropzoneTitle: "Drag your image here or",
    dropzoneCta: "select a file",
    dropzoneHint: "PNG, JPG, WebP or SVG",
    change: "Change",
    processingPrecise: "Processing shapes…",
    processingSilhouette: "Extracting silhouette…",
    errorOnlySvg: "Only SVG files are accepted.",
    errorOnlyPng: "Only PNG files are accepted.",
    errorOnlyPngOrSvg: "Only PNG, JPG, WebP or SVG files are accepted."
  },
  preview: {
    title: "Generated skeleton",
    animation: "Animation",
    duration: "Duration",
    smilNote: "The skeleton uses SMIL animateTransform — supported in Chrome, Firefox, and Edge."
  },
  animations: {
    "left-right": "Left → Right",
    "right-left": "Right → Left",
    "top-bottom": "Top → Bottom",
    "bottom-top": "Bottom → Top",
    diagonal: "Diagonal",
    radial: "Radial",
    pulse: "Pulse",
    wave: "Wave"
  },
  exportModal: {
    title: "Export skeleton",
    close: "Close",
    framework: "Framework",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    exportButton: "Export code",
    themeLight: "light",
    themeDark: "dark",
    animationExport: "Export as animation",
    exportGif: "Animated GIF",
    exportVideo: "WebM Video",
    exportingProgress: "Generating frames… {n}%",
    exportError: "Export failed"
  },
  container: {
    uploadTitle: "PNG, JPG, WebP or SVG Image",
    uploadSubtitle: "Upload an image file to generate its skeleton.",
    emptyTitle: "Waiting for your image…",
    emptySubtitle: "Upload a PNG, JPG, WebP or SVG file on the left to see the generated animated skeleton here."
  },
  footer: {
    name: "Skeleton Generator",
    frameworks: "React · Angular · Vue · React Native · Flutter"
  },
  language: {
    label: "Language",
    es: "Español",
    en: "English"
  },
  theme: {
    switchToLight: "Switch to light theme",
    switchToDark: "Switch to dark theme"
  },
  landing: {
    titleLine1: "Create Skeletons",
    titleGradient: "animated,",
    titleLine3: "in seconds.",
    subtitle: "Generate animated skeleton loaders from any design. Copy the code and use it in your project.",
    ctaPrimary: "Get started",
    ctaGithub: "View on GitHub"
  }
}

export default en
