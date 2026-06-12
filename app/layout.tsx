import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "无人机集群智能 | 协同决策系统研究",
  description:
    "探索自主无人机集群如何学会协同合作——在动态环境中平衡编队、追踪与安全。",
  keywords: [
    "无人机集群",
    "编队控制",
    "协同AI",
    "多智能体系统",
    "强化学习",
    "自主无人机",
  ],
  openGraph: {
    title: "无人机集群智能 | 协同决策系统研究",
    description: "探索自主无人机集群如何学会协同合作",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-space-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
