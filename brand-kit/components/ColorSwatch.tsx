'use client';

import { useState } from 'react';
import type { Color } from '@/types';

interface ColorSwatchProps {
  color: Color;
  variant?: 'primary' | 'secondary' | 'neutral';
}

export function ColorSwatch({ color, variant = 'primary' }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#18181b' : '#fafafa';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyCSS = async () => {
    try {
      const cssVar = `--${variant}-${color.name.toLowerCase()}`;
      await navigator.clipboard.writeText(`var(${cssVar})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const textColor = getContrastColor(color.value);

  return (
    <div className="color-swatch bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-200">
      <div
        className="h-24 relative cursor-pointer"
        style={{ backgroundColor: color.value }}
        onClick={handleCopy}
      >
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <span
            className="text-sm font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: textColor, color: color.value }}
          >
            {copied ? '✓ 已复制' : '点击复制 HEX'}
          </span>
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold text-neutral-900 text-sm">{color.name}</h4>
            <p className="text-xs text-neutral-500">{color.value}</p>
          </div>
        </div>
        <button
          onClick={handleCopyCSS}
          className="copy-button w-full text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-1.5 rounded-lg transition-colors"
        >
          {copied ? '✓ 已复制 CSS 变量' : `复制 var(--${variant}-${color.name.toLowerCase()})`}
        </button>
      </div>
    </div>
  );
}
