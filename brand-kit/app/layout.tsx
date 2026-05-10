import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Brand Kit - 品牌色值管理工具',
  description: '基于 Next.js + CSS 变量的品牌色值管理工具，支持主色、辅助色、字体规范和一键复制样式代码',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
