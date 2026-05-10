import { ColorPalette } from '@/components/ColorPalette';
import { FontSection } from '@/components/FontSection';
import { CodeExport } from '@/components/CodeExport';
import type { BrandKit } from '@/types';

const defaultBrandKit: BrandKit = {
  colors: {
    primary: [
      { id: 'p-50', name: '50', value: '#eff6ff', description: '最浅色，用于背景高亮' },
      { id: 'p-100', name: '100', value: '#dbeafe' },
      { id: 'p-200', name: '200', value: '#bfdbfe' },
      { id: 'p-300', name: '300', value: '#93c5fd' },
      { id: 'p-400', name: '400', value: '#60a5fa' },
      { id: 'p-500', name: '500', value: '#3b82f6', description: '主色，用于品牌识别' },
      { id: 'p-600', name: '600', value: '#2563eb' },
      { id: 'p-700', name: '700', value: '#1d4ed8' },
      { id: 'p-800', name: '800', value: '#1e40af' },
      { id: 'p-900', name: '900', value: '#1e3a8a', description: '最深色，用于强调文本' },
    ],
    secondary: [
      { id: 's-50', name: '50', value: '#f0fdf4' },
      { id: 's-100', name: '100', value: '#dcfce7' },
      { id: 's-200', name: '200', value: '#bbf7d0' },
      { id: 's-300', name: '300', value: '#86efac' },
      { id: 's-400', name: '400', value: '#4ade80' },
      { id: 's-500', name: '500', value: '#22c55e', description: '辅助色，用于成功状态' },
      { id: 's-600', name: '600', value: '#16a34a' },
      { id: 's-700', name: '700', value: '#15803d' },
      { id: 's-800', name: '800', value: '#166534' },
      { id: 's-900', name: '900', value: '#14532d' },
    ],
    neutral: [
      { id: 'n-50', name: '50', value: '#fafafa' },
      { id: 'n-100', name: '100', value: '#f4f4f5' },
      { id: 'n-200', name: '200', value: '#e4e4e7' },
      { id: 'n-300', name: '300', value: '#d4d4d8' },
      { id: 'n-400', name: '400', value: '#a1a1aa' },
      { id: 'n-500', name: '500', value: '#71717a', description: '中性色，用于次要文本' },
      { id: 'n-600', name: '600', value: '#52525b' },
      { id: 'n-700', name: '700', value: '#3f3f46' },
      { id: 'n-800', name: '800', value: '#27272a' },
      { id: 'n-900', name: '900', value: '#18181b', description: '深色，用于主要文本' },
    ],
  },
  fonts: [
    {
      id: 'f-heading',
      name: '标题',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: '2.5rem',
      description: '用于页面标题和重要文案',
    },
    {
      id: 'f-subheading',
      name: '副标题',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: '2rem',
      description: '用于章节标题和次级标题',
    },
    {
      id: 'f-body',
      name: '正文',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: '1.5rem',
      description: '用于主要文本内容',
    },
    {
      id: 'f-caption',
      name: '说明文字',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      description: '用于标签、辅助说明和元数据',
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Brand Kit</h1>
              <p className="text-neutral-600 mt-1">品牌色值与字体规范管理工具</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg">
                <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                <span className="w-4 h-4 rounded-full bg-green-500"></span>
                <span className="w-4 h-4 rounded-full bg-neutral-500"></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ColorPalette
          title="主色调"
          description="品牌的核心识别色，用于主要按钮、链接和关键交互元素"
          colors={defaultBrandKit.colors.primary}
          variant="primary"
        />

        <ColorPalette
          title="辅助色"
          description="用于状态提示、成功/警告/错误信息和次要强调元素"
          colors={defaultBrandKit.colors.secondary}
          variant="secondary"
        />

        <ColorPalette
          title="中性色"
          description="用于文本、背景、边框和其他UI元素，建立清晰的视觉层次"
          colors={defaultBrandKit.colors.neutral}
          variant="neutral"
        />

        <FontSection fonts={defaultBrandKit.fonts} />

        <CodeExport brandKit={defaultBrandKit} />
      </div>

      <footer className="bg-white border-t border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 text-sm">
              基于 Next.js + CSS 变量构建的品牌设计系统
            </p>
            <div className="flex items-center gap-4">
              <span className="text-neutral-500 text-sm">点击任意颜色复制 HEX 值</span>
              <span className="text-neutral-500 text-sm">支持 CSS 变量和 Tailwind 配置导出</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
