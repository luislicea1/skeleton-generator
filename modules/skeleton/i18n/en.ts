import type { Translations } from './types';

const en: Translations = {
  header: {
    title: 'Skeleton Generator',
    subtitle: 'Convert SVGs into animated skeletons',
    badge: 'React · Angular · Vue · Flutter',
  },
  uploader: {
    title: 'PNG Image',
    subtitle: 'Upload a PNG file to generate its skeleton.',
    algorithm: 'Algorithm',
    modePrecise: 'Precise',
    modePreciseDesc: 'Preserves the original shapes. Ideal for logos and simple icons.',
    modeSilhouette: 'Silhouette',
    modeSilhouetteDesc: 'Extracts only the outer contour with smooth curves. Ideal for complex images.',
    dropzoneTitle: 'Drag your PNG here or',
    dropzoneCta: 'select a file',
    dropzoneHint: 'PNG files only',
    change: 'Change',
    processingPrecise: 'Processing shapes…',
    processingSilhouette: 'Extracting silhouette…',
    errorOnlySvg: 'Only SVG files are accepted.',
    errorOnlyPng: 'Only PNG files are accepted.',
  },
  preview: {
    title: 'Generated skeleton',
    animation: 'Animation',
    duration: 'Duration',
    smilNote: 'The skeleton uses SMIL animateTransform — supported in Chrome, Firefox, and Edge.',
  },
  animations: {
    'left-right': 'Left → Right',
    'right-left': 'Right → Left',
    'top-bottom': 'Top → Bottom',
    'bottom-top': 'Bottom → Top',
    diagonal: 'Diagonal',
    radial: 'Radial',
    pulse: 'Pulse',
    wave: 'Wave',
  },
  exportModal: {
    title: 'Export skeleton',
    close: 'Close',
    framework: 'Framework',
    copy: 'Copy',
    copied: 'Copied',
    download: 'Download',
    exportButton: 'Export code',
    themeLight: 'light',
    themeDark: 'dark',
  },
  container: {
    uploadTitle: 'PNG Image',
    uploadSubtitle: 'Upload a PNG file to generate its skeleton.',
    emptyTitle: 'Waiting for your PNG…',
    emptySubtitle: 'Upload a PNG file on the left to see the generated animated skeleton here.',
  },
  footer: {
    name: 'Skeleton Generator',
    frameworks: 'React · Angular · Vue · React Native · Flutter',
  },
  language: {
    label: 'Language',
    es: 'Español',
    en: 'English',
  },
  theme: {
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme',
  },
};

export default en;
