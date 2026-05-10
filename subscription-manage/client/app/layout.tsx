import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "会员订阅管理系统",
  description: "管理会员订阅、套餐配置、续费记录的数据看板系统",
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
