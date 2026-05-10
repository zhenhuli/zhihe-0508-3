'use client';

import { useState } from 'react';
import { FontSpecCard } from './FontSpecCard';
import type { FontSpec } from '@/types';

interface FontSectionProps {
  fonts: FontSpec[];
}

export function FontSection({ fonts }: FontSectionProps) {
  const [copied, setCopied] = useState(false);

  const generateCSSVariables = () => {
    const uniqueFamilies = Array.from(new Set(fonts.map((f) => f.fontFamily.split(',')[0])));
    let css = '';
    uniqueFamilies.forEach((family, index) => {
      if (index === 0) {
        css += `--font-display: ${fonts[0].fontFamily};\n`;
        css += `--font-body: ${fonts[0].fontFamily};\n`;
      }
    });
    return css;
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
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">字体规范</h2>
          <p className="text-neutral-600">统一的字体层级确保一致的阅读体验和视觉节奏</p>
        </div>
        <button
          onClick={handleCopyAll}
          className="copy-button px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          {copied ? '✓ 已复制全部' : '复制全部 CSS 变量'}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {fonts.map((font) => (
          <FontSpecCard key={font.id} font={font} />
        ))}
      </div>
    </section>
  );
}
