"use client"

import { useEffect, useState } from 'react'
import { createHighlighter, type Highlighter } from 'shiki'
import type { Theme } from '../types/skeleton'

export interface CodeHighlightProps {
  code: string
  language: string
  theme?: Theme
  showLineNumbers?: boolean
  wrap?: boolean
  className?: string
  title?: string
  showCopyButton?: boolean
}

const codeThemeConfig = {
  font: {
    family: "'Cascadia Code', 'JetBrains Mono', monospace",
    ligatures: true,
    size: '14px',
  },
}

const languageMap: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  html: 'html',
  css: 'css',
  json: 'json',
  bash: 'bash',
  markdown: 'markdown',
  sql: 'sql',
  yaml: 'yaml',
  jsx: 'jsx',
  tsx: 'tsx',
}

function mapToShikiLanguage(lang: string): string {
  return languageMap[lang] || 'text'
}

let highlighter: Highlighter | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['catppuccin-mocha', 'catppuccin-latte'],
      langs: ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'bash', 'markdown', 'sql', 'yaml', 'jsx', 'tsx'],
    })
  }
  return highlighter
}

export default function CodeHighlight({
  code,
  language,
  theme = 'dark',
  showLineNumbers = false,
  wrap = false,
  className = '',
  title,
  showCopyButton = true,
}: CodeHighlightProps) {
  const [copied, setCopied] = useState(false)
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)

  const shikiTheme = theme === 'dark' ? 'catppuccin-mocha' : 'catppuccin-latte'
  const bgColor = theme === 'dark' ? '#1e1e2e' : '#eff1f5'

  useEffect(() => {
    let cancelled = false

    async function highlight() {
      try {
        const hl = await getHighlighter()
        const lang = mapToShikiLanguage(language)
        const highlighted = hl.codeToHtml(code, { lang, theme: shikiTheme })
        if (!cancelled) {
          setHtml(highlighted)
          setLoading(false)
        }
      } catch (error) {
        console.error('Syntax highlighting error:', error)
        if (!cancelled) {
          setHtml(`<pre>${code}</pre>`)
          setLoading(false)
        }
      }
    }

    highlight()

    return () => {
      cancelled = true
    }
  }, [code, language, shikiTheme])

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={`flex flex-col gap-0 rounded-xl overflow-hidden border border-gray-700/50 dark:border-gray-700/50 ${className}`}>
      {(title || showCopyButton) && (
        <div 
          className="flex items-center justify-between px-4 py-2 border-b border-gray-700/50 dark:border-gray-700/50"
          style={{ backgroundColor: theme === 'dark' ? '#181825' : '#e6e9ef' }}
        >
          {title && (
            <span className="text-xs text-gray-400 dark:text-gray-400 font-mono" style={{ color: theme === 'dark' ? '#a6adc8' : '#6c6f85' }}>{title}</span>
          )}
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors"
              style={{ 
                backgroundColor: theme === 'dark' ? '#45475a' : '#ccd0da', 
                color: theme === 'dark' ? '#cdd6f4' : '#4c4f69' 
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      )}
      <div
        className={`overflow-auto ${
          wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
        }`}
        style={{ 
          maxHeight: '24rem',
          backgroundColor: bgColor
        }}
      >
        {loading ? (
          <pre className="p-4 text-sm" style={{ fontFamily: codeThemeConfig.font.family }}>
            {code}
          </pre>
        ) : (
          <div
            className={`text-sm leading-relaxed ${
              showLineNumbers ? 'pl-12' : ''
            }`}
            style={{
              fontFamily: codeThemeConfig.font.family,
              fontVariantLigatures: codeThemeConfig.font.ligatures ? 'common-ligatures contextual' : 'none',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  )
}
