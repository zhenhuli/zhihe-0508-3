'use client';

import { useState } from 'react';
import { ColorSwatch } from './ColorSwatch';
import type { Color } from '@/types';

interface ColorPaletteProps {
  title: string;
  description: string;
  colors: Color[];
  variant: 'primary' | 'secondary' | 'neutral';
}

export function ColorPalette({ title, description, colors, variant }: ColorPaletteProps) {
  const [copied, setCopied] = useState(false);

  const generateCSSVariables = () => {
    return colors
      .map((color) => `--${variant}-${color.name.toLowerCase()}: ${color.value};`)
      .join('\n');
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(generateCSSVariables());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="mb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h2>
          <p className="text-neutral-600">{description}</p>
        </div>
        <button
          onClick={handleCopyAll}
          className="copy-button px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          {copied ? '✓ 已复制全部' : '复制全部 CSS 变量'}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {colors.map((color) => (
          <ColorSwatch key={color.id} color={color} variant={variant} />
        ))}
      </div>
    </section>
  );
}
