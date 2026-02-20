import type { Framework, SvgData, Theme, AnimationType } from '../types/skeleton';
import { THEME_COLORS } from '../types/skeleton';
import { buildGradientDefs } from './svgParser';

// ---------------------------------------------------------------------------
// Attribute name conversion: SVG HTML → JSX camelCase
// ---------------------------------------------------------------------------
const SVG_TO_JSX: Record<string, string> = {
  'stop-color':           'stopColor',
  'stop-opacity':         'stopOpacity',
  'fill-rule':            'fillRule',
  'clip-rule':            'clipRule',
  'clip-path':            'clipPath',
  'stroke-width':         'strokeWidth',
  'stroke-linecap':       'strokeLinecap',
  'stroke-linejoin':      'strokeLinejoin',
  'stroke-dasharray':     'strokeDasharray',
  'stroke-dashoffset':    'strokeDashoffset',
  'stroke-miterlimit':    'strokeMiterlimit',
  'stroke-opacity':       'strokeOpacity',
  'fill-opacity':         'fillOpacity',
  'shape-rendering':      'shapeRendering',
  'text-rendering':       'textRendering',
  'image-rendering':      'imageRendering',
  'color-interpolation':  'colorInterpolation',
  'color-rendering':      'colorRendering',
  'vector-effect':        'vectorEffect',
  'marker-start':         'markerStart',
  'marker-mid':           'markerMid',
  'marker-end':           'markerEnd',
  'class':                'className',
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toJsxAttrs(body: string): string {
  let result = body;
  for (const [from, to] of Object.entries(SVG_TO_JSX)) {
    result = result.replace(new RegExp(`\\b${escapeRegex(from)}=`, 'g'), `${to}=`);
  }
  return result;
}

// Capitalize SVG element names for react-native-svg (path → Path, g → G, etc.)
function toRnBody(body: string): string {
  let result = toJsxAttrs(body);
  const tags = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line', 'g'];
  for (const tag of tags) {
    const cap = tag.charAt(0).toUpperCase() + tag.slice(1);
    result = result
      .replace(new RegExp(`<${tag}(\\s|\\/|>)`, 'g'), `<${cap}$1`)
      .replace(new RegExp(`<\\/${tag}>`, 'g'), `</${cap}>`);
  }
  return result;
}

function getUsedRnComponents(rnBody: string): string[] {
  const base = ['Svg', 'Defs', 'LinearGradient', 'Stop'];
  const optional = ['G', 'Path', 'Rect', 'Circle', 'Ellipse', 'Polygon', 'Polyline', 'Line'];
  return [...base, ...optional.filter(c => rnBody.includes(`<${c}`))];
}

/** Convert the raw defs block to JSX (camelCase attributes) */
function defsToJsx(defs: string): string {
  let result = toJsxAttrs(defs);
  result = result.replace(/\battributeName=/g, 'attributeName=');
  result = result.replace(/\brepeatCount=/g, 'repeatCount=');
  return result;
}

/** Convert the raw defs block to React Native components */
function defsToRn(defs: string): string {
  let result = defsToJsx(defs);
  const rnTags: Record<string, string> = {
    'linearGradient': 'LinearGradient',
    'radialGradient': 'RadialGradient',
    'stop': 'Stop',
    'animate': 'Animate',
    'animateTransform': 'AnimateTransform',
  };
  for (const [tag, cap] of Object.entries(rnTags)) {
    result = result
      .replace(new RegExp(`<${tag}(\\s|\\/|>)`, 'g'), `<${cap}$1`)
      .replace(new RegExp(`<\\/${tag}>`, 'g'), `</${cap}>`);
  }
  result = result
    .replace(/<defs>/g, '<Defs>')
    .replace(/<\/defs>/g, '</Defs>');
  return result;
}

// ---------------------------------------------------------------------------
// React
// ---------------------------------------------------------------------------
export function generateReact(data: SvgData, theme: Theme, animation: AnimationType, duration: number): string {
  const body = toJsxAttrs(data.skeletonBody);
  const { start, mid } = THEME_COLORS[theme];
  const rawDefs = buildGradientDefs(start, mid, animation, duration);
  const jsxDefs = defsToJsx(rawDefs);

  return `import React from "react";

const LogoSkeleton: React.FC = () => {
    return (
        <svg
            width="${data.width}"
            height="${data.height}"
            viewBox="${data.viewBox}"
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            fillRule="evenodd"
            clipRule="evenodd"
        >
${jsxDefs}

${body}

        </svg>
    );
};

export default LogoSkeleton;
`;
}

// ---------------------------------------------------------------------------
// Angular
// ---------------------------------------------------------------------------
export function generateAngular(data: SvgData, theme: Theme, animation: AnimationType, duration: number): string {
  const { start, mid } = THEME_COLORS[theme];
  const defs = buildGradientDefs(start, mid, animation, duration);

  return `import { Component } from '@angular/core';

@Component({
    selector: 'app-logo-skeleton',
    standalone: true,
    template: \`
        <svg
            width="${data.width}"
            height="${data.height}"
            viewBox="${data.viewBox}"
            xmlns="http://www.w3.org/2000/svg"
            shape-rendering="geometricPrecision"
            text-rendering="geometricPrecision"
            fill-rule="evenodd"
            clip-rule="evenodd"
        >
${defs}

${data.skeletonBody}

        </svg>
    \`,
})
export class LogoSkeletonComponent {}
`;
}

// ---------------------------------------------------------------------------
// Vue
// ---------------------------------------------------------------------------
export function generateVue(data: SvgData, theme: Theme, animation: AnimationType, duration: number): string {
  const { start, mid } = THEME_COLORS[theme];
  const defs = buildGradientDefs(start, mid, animation, duration);

  return `<template>
    <svg
        width="${data.width}"
        height="${data.height}"
        viewBox="${data.viewBox}"
        xmlns="http://www.w3.org/2000/svg"
        shape-rendering="geometricPrecision"
        text-rendering="geometricPrecision"
        fill-rule="evenodd"
        clip-rule="evenodd"
    >
${defs}

${data.skeletonBody}

    </svg>
</template>

<script setup lang="ts">
// Static skeleton loader – no reactive state needed
</script>
`;
}

// ---------------------------------------------------------------------------
// React Native
// ---------------------------------------------------------------------------
export function generateReactNative(data: SvgData, theme: Theme, animation: AnimationType, duration: number): string {
  const rnBody = toRnBody(data.skeletonBody);
  const components = getUsedRnComponents(rnBody);
  const widthNum = parseFloat(data.width) || 100;
  const heightNum = parseFloat(data.height) || 100;
  const { start, mid } = THEME_COLORS[theme];
  const rawDefs = buildGradientDefs(start, mid, animation, duration);
  const rnDefs = defsToRn(rawDefs);

  if (rnDefs.includes('<RadialGradient') && !components.includes('RadialGradient')) {
    const idx = components.indexOf('LinearGradient');
    if (idx !== -1) components[idx] = 'RadialGradient';
    else components.push('RadialGradient');
  }

  const defsInner = rnDefs
    .replace(/^\s*<Defs>\n?/, '')
    .replace(/\n?\s*<\/Defs>\s*$/, '')
    .replace(/^\s*<defs>\n?/, '')
    .replace(/\n?\s*<\/defs>\s*$/, '');

  const durationMs = Math.round(duration * 1000);
  const halfMs = Math.round(durationMs / 2);

  return `import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { ${components.join(', ')} } from "react-native-svg";

// react-native-svg does not support SVG SMIL animations natively.
// This component uses React Native's Animated API for the shimmer effect.

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const LogoSkeleton: React.FC = () => {
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, {
                    toValue: 1,
                    duration: ${halfMs},
                    useNativeDriver: true,
                }),
                Animated.timing(shimmer, {
                    toValue: 0,
                    duration: ${halfMs},
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmer]);

    const opacity = shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 1],
    });

    return (
        <AnimatedSvg
            width={${widthNum}}
            height={${heightNum}}
            viewBox="${data.viewBox}"
            style={{ opacity }}
        >
            <Defs>
${defsInner}
            </Defs>

${rnBody}

        </AnimatedSvg>
    );
};

export default LogoSkeleton;
`;
}

// ---------------------------------------------------------------------------
// Flutter
// ---------------------------------------------------------------------------
export function generateFlutter(data: SvgData, theme: Theme, _animation: AnimationType, duration: number): string {
  const { start } = THEME_COLORS[theme];
  const staticBody = data.skeletonBody.replace(/fill="url\(#skeletonGradient\)"/g, `fill="${start}"`);
  const svgString = `<svg width="${data.width}" height="${data.height}" viewBox="${data.viewBox}" xmlns="http://www.w3.org/2000/svg">\n${staticBody}\n</svg>`;

  const widthNum = parseFloat(data.width) || 100;
  const heightNum = parseFloat(data.height) || 100;
  const { mid } = THEME_COLORS[theme];
  const durationMs = Math.round(duration * 1000);

  const toFlutterColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `Color(0xFF${r.toString(16).padStart(2,'0').toUpperCase()}${g.toString(16).padStart(2,'0').toUpperCase()}${b.toString(16).padStart(2,'0').toUpperCase()})`;
  };

  return `import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shimmer/shimmer.dart';

// Required dependencies – add to pubspec.yaml:
//
//   dependencies:
//     flutter_svg: ^2.0.0
//     shimmer: ^3.0.0

class LogoSkeleton extends StatelessWidget {
    const LogoSkeleton({super.key});

    static const String _svgData = '''${svgString}''';

    @override
    Widget build(BuildContext context) {
        return Shimmer.fromColors(
            period: const Duration(milliseconds: ${durationMs}),
            baseColor: const ${toFlutterColor(start)},
            highlightColor: const ${toFlutterColor(mid)},
            child: SvgPicture.string(
                _svgData,
                width: ${widthNum},
                height: ${heightNum},
                colorFilter: const ColorFilter.mode(
                    Colors.grey,
                    BlendMode.srcATop,
                ),
            ),
        );
    }
}
`;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
export function generateCode(
  framework: Framework,
  data: SvgData,
  theme: Theme,
  animation: AnimationType = 'left-right',
  duration: number = 1.5,
): string {
  switch (framework) {
    case 'react':         return generateReact(data, theme, animation, duration);
    case 'angular':       return generateAngular(data, theme, animation, duration);
    case 'vue':           return generateVue(data, theme, animation, duration);
    case 'react-native':  return generateReactNative(data, theme, animation, duration);
    case 'flutter':       return generateFlutter(data, theme, animation, duration);
  }
}