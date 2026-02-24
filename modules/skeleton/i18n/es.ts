import type { Translations } from './types';

const es: Translations = {
  header: {
    title: 'Skeleton Generator',
    subtitle: 'Convierte SVGs en skeletons animados',
    badge: 'React · Angular · Vue · Flutter',
  },
  uploader: {
    title: 'Imagen PNG',
    subtitle: 'Sube un archivo PNG para generar su skeleton.',
    algorithm: 'Algoritmo',
    modePrecise: 'Preciso',
    modePreciseDesc: 'Conserva las formas originales. Ideal para logos e íconos simples.',
    modeSilhouette: 'Silueta',
    modeSilhouetteDesc: 'Extrae solo el contorno exterior con curvas suaves. Ideal para imágenes complejas.',
    dropzoneTitle: 'Arrastra tu PNG aquí o',
    dropzoneCta: 'selecciona un archivo',
    dropzoneHint: 'Solo archivos PNG',
    change: 'Cambiar',
    processingPrecise: 'Procesando formas…',
    processingSilhouette: 'Extrayendo silueta…',
    errorOnlySvg: 'Solo se aceptan archivos SVG.',
    errorOnlyPng: 'Solo se aceptan archivos PNG.',
  },
  preview: {
    title: 'Skeleton generado',
    animation: 'Animación',
    duration: 'Duración',
    smilNote: 'El skeleton usa SMIL animateTransform — soportado en Chrome, Firefox y Edge.',
  },
  animations: {
    'left-right': 'Izq → Der',
    'right-left': 'Der → Izq',
    'top-bottom': 'Arriba → Abajo',
    'bottom-top': 'Abajo → Arriba',
    diagonal: 'Diagonal',
    radial: 'Radial',
    pulse: 'Pulso',
    wave: 'Onda',
  },
  exportModal: {
    title: 'Exportar skeleton',
    close: 'Cerrar',
    framework: 'Framework',
    copy: 'Copiar',
    copied: 'Copiado',
    download: 'Descargar',
    exportButton: 'Exportar código',
    themeLight: 'claro',
    themeDark: 'oscuro',
  },
  container: {
    uploadTitle: 'Imagen PNG',
    uploadSubtitle: 'Sube un archivo PNG para generar su skeleton.',
    emptyTitle: 'Esperando tu PNG…',
    emptySubtitle: 'Sube un archivo PNG a la izquierda para ver el skeleton animado generado aquí.',
  },
  footer: {
    name: 'Skeleton Generator',
    frameworks: 'React · Angular · Vue · React Native · Flutter',
  },
  language: {
    label: 'Idioma',
    es: 'Español',
    en: 'English',
  },
  theme: {
    switchToLight: 'Cambiar a tema claro',
    switchToDark: 'Cambiar a tema oscuro',
  },
};

export default es;
