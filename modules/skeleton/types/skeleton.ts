export type Framework = 'react' | 'angular' | 'vue' | 'react-native' | 'flutter';
export type Theme = 'light' | 'dark';

export type AnimationType =
  | 'left-right'
  | 'right-left'
  | 'top-bottom'
  | 'bottom-top'
  | 'diagonal'
  | 'radial'
  | 'pulse'
  | 'wave';

  export interface AnimationOption {
  id: AnimationType;
  label: string;
  desc: string;
}

export type SkeletonMode = 'precise' | 'silhouette';

export interface SvgData {
  width: string;
  height: string;
  viewBox: string;
  skeletonBody: string;
  rawSvg: string;
}

export const DURATION_DEFAULT = 1.5;
export const DURATION_MIN = 0.5;
export const DURATION_MAX = 3.0;
export const DURATION_STEP = 0.1;

export const THEME_COLORS: Record<Theme, { start: string; mid: string }> = {
  light: { start: '#e0e0e0', mid: '#f5f5f5' },
  dark:  { start: '#2a2a2a', mid: '#4a4a4a' },
};

export const ANIMATIONS: AnimationOption[] = [
  { id: 'left-right',  label: 'Izq → Der',    desc: 'Shimmer horizontal clásico' },
  { id: 'right-left',  label: 'Der → Izq',    desc: 'Shimmer horizontal inverso' },
  { id: 'top-bottom',  label: 'Arriba → Abajo', desc: 'Shimmer vertical descendente' },
  { id: 'bottom-top',  label: 'Abajo → Arriba', desc: 'Shimmer vertical ascendente' },
  { id: 'pulse',       label: 'Pulso',        desc: 'Opacidad pulsante' },
  { id: 'wave',        label: 'Onda',         desc: 'Escala pulsante suave' },
  { id: 'diagonal',    label: 'Diagonal',     desc: 'Shimmer en diagonal' },
  { id: 'radial',      label: 'Radial',       desc: 'Brillo desde el centro' },
];

export interface FrameworkOption {
  id: Framework;
  label: string;
  filename: string;
}

export interface SvgData {
  width: string;
  height: string;
  viewBox: string;
  skeletonBody: string;
  rawSvg: string;
}

export const FRAMEWORKS: FrameworkOption[] = [
  { id: 'react',         label: 'React',         filename: 'LogoSkeleton.tsx' },
  { id: 'angular',       label: 'Angular',        filename: 'logo-skeleton.component.ts' },
  { id: 'vue',           label: 'Vue',            filename: 'LogoSkeleton.vue' },
  { id: 'react-native',  label: 'React Native',   filename: 'LogoSkeleton.tsx' },
  { id: 'flutter',       label: 'Flutter',        filename: 'logo_skeleton.dart' },
];