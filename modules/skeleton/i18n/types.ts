export type Language = 'es' | 'en';

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    badge: string;
  };
  uploader: {
    title: string;
    subtitle: string;
    algorithm: string;
    modePrecise: string;
    modePreciseDesc: string;
    modeSilhouette: string;
    modeSilhouetteDesc: string;
    dropzoneTitle: string;
    dropzoneCta: string;
    dropzoneHint: string;
    change: string;
    processingPrecise: string;
    processingSilhouette: string;
    errorOnlySvg: string;
    errorOnlyPng: string;
  };
  preview: {
    title: string;
    animation: string;
    duration: string;
    smilNote: string;
  };
  animations: {
    'left-right': string;
    'right-left': string;
    'top-bottom': string;
    'bottom-top': string;
    diagonal: string;
    radial: string;
    pulse: string;
    wave: string;
  };
  exportModal: {
    title: string;
    close: string;
    framework: string;
    copy: string;
    copied: string;
    download: string;
    exportButton: string;
    themeLight: string;
    themeDark: string;
  };
  container: {
    uploadTitle: string;
    uploadSubtitle: string;
    emptyTitle: string;
    emptySubtitle: string;
  };
  footer: {
    name: string;
    frameworks: string;
  };
  language: {
    label: string;
    es: string;
    en: string;
  };
  theme: {
    switchToLight: string;
    switchToDark: string;
  };
}
