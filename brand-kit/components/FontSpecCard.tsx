'use client';

import { useState } from 'react';
import type { FontSpec } from '@/types';

interface FontSpecCardProps {
  font: FontSpec;
}

export function FontSpecCard({ font }: FontSpecCardProps) {
  const [copied, setCopied] = useState(false);

  const generateCSS = () => {
    const css = [
      `font-family: ${font.fontFamily};`,
      `font-weight: ${font.fontWeight};`,
      `font-size: ${font.fontSize};`,
      `line-height: ${font.lineHeight};`,
    ];
    if (font.letterSpacing) {
      css.push(`letter-spacing: ${font.letterSpacing};`);
    }
    return css.join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-lg text-neutral-900">{font.name}</h4>
          {font.description && (
            <p className="text-sm text-neutral-500 mt-1">{font.description}</p>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="copy-button px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition-colors"
        >
          {copied ? '✓ 已复制' : '复制 CSS'}
        </button>
      </div>
      <div
        className="mb-4 p-4 bg-neutral-50 rounded-lg"
        style={{
          fontFamily: font.fontFamily,
          fontWeight: font.fontWeight,
          fontSize: font.fontSize,
          lineHeight: font.lineHeight,
          letterSpacing: font.letterSpacing || 'normal',
        }}
      >
        设计系统是产品的视觉语言基础。
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-neutral-50 rounded-lg p-3">
          <span className="text-neutral-500 block text-xs mb-1">Font Family</span>
          <span className="text-neutral-900 font-medium">{font.fontFamily.split(',')[0]}</span>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <span className="text-neutral-500 block text-xs mb-1">Font Weight</span>
          <span className="text-neutral-900 font-medium">{font.fontWeight}</span>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <span className="text-neutral-500 block text-xs mb-1">Font Size</span>
          <span className="text-neutral-900 font-medium">{font.fontSize}</span>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <span className="text-neutral-500 block text-xs mb-1">Line Height</span>
          <span className="text-neutral-900 font-medium">{font.lineHeight}</span>
        </div>
      </div>
    </div>
  );
}
