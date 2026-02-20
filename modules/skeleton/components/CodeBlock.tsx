"use client"

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../context/language-context';

interface CodeBlockProps {
  code: string;
  filename: string;
}

export default function CodeBlock({ code, filename }: CodeBlockProps) {
  const t = useTranslation();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const downloadHref = `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{filename}</span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 border border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-transparent cursor-pointer"
          >
            {copied ? (
              <>
                <Icon icon="lucide:check" className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                <span className="text-green-600 dark:text-green-400">{t.exportModal.copied}</span>
              </>
            ) : (
              <>
                <Icon icon="lucide:clipboard" className="w-3.5 h-3.5" />
                {t.exportModal.copy}
              </>
            )}
          </button>
          <a
            href={downloadHref}
            download={filename}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
          >
            <Icon icon="lucide:download" className="w-3.5 h-3.5" />
            {t.exportModal.download}
          </a>
        </div>
      </div>

      {/* Code */}
      <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700/50">
        <pre className="overflow-auto max-h-96 p-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
