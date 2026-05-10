'use client';

import { useState } from 'react';
import type { BrandKit } from '@/types';

interface CodeExportProps {
  brandKit: BrandKit;
}

export function CodeExport({ brandKit }: CodeExportProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'css' | 'tailwind'>('css');

  const generateCSS = () => {
    const parts: string[] = [];
    
    parts.push(':root {');
    
    ['primary', 'secondary', 'neutral'].forEach((variant) => {
      const colors = brandKit.colors[variant as keyof typeof brandKit.colors];
      colors.forEach((color) => {
        parts.push(`  --${variant}-${color.name.toLowerCase()}: ${color.value};`);
      });
    });
    
    parts.push('');
    parts.push(`  --font-display: ${brandKit.fonts[0]?.fontFamily || 'system-ui'};`);
    parts.push(`  --font-body: ${brandKit.fonts[0]?.fontFamily || 'system-ui'};`);
    parts.push('}');
    
    return parts.join('\n');
  };

  const generateTailwind = () => {
    const parts: string[] = [];
    parts.push('// tailwind.config.js');
    parts.push('module.exports = {');
    parts.push('  theme: {');
    parts.push('    extend: {');
    parts.push('      colors: {');
    
    ['primary', 'secondary', 'neutral'].forEach((variant) => {
      parts.push(`        ${variant}: {`);
      const colors = brandKit.colors[variant as keyof typeof brandKit.colors];
      colors.forEach((color) => {
        parts.push(`          '${color.name.toLowerCase()}': '${color.value}',`);
      });
      parts.push('        },');
    });
    
    parts.push('      },');
    parts.push('    },');
    parts.push('  },');
    parts.push('};');
    
    return parts.join('\n');
  };

  const handleCopy = async () => {
    try {
      const code = activeTab === 'css' ? generateCSS() : generateTailwind();
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const code = activeTab === 'css' ? generateCSS() : generateTailwind();

  return (
    <section className="mb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">代码导出</h2>
          <p className="text-neutral-600">一键复制完整的样式代码到你的项目中</p>
        </div>
        <button
          onClick={handleCopy}
          className="copy-button px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          {copied ? '✓ 已复制' : '复制全部代码'}
        </button>
      </div>
      
      <div className="bg-neutral-900 rounded-xl overflow-hidden">
        <div className="flex border-b border-neutral-800">
          <button
            onClick={() => setActiveTab('css')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'css'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            CSS Variables
          </button>
          <button
            onClick={() => setActiveTab('tailwind')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'tailwind'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Tailwind Config
          </button>
        </div>
        <pre className="p-6 text-sm text-neutral-100 overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </section>
  );
}
