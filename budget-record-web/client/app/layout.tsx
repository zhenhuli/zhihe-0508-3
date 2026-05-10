import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '个人记账工具',
  description: 'Next.js + localStorage + Express 实现的个人网页记账工具',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-indigo-700 mb-2">个人记账工具</h1>
            <p className="text-gray-700">轻松记录每一笔收支，掌握财务状况</p>
          </header>
          <main>{children}</main>
          <footer className="mt-12 text-center text-gray-600 text-sm">
            <p>数据保存在本地，可同步到服务端备份</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
