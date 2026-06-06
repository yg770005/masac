import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MASAC | 多智能体强化学习无人机协同决策系统",
  description:
    "Multi-Agent Soft Actor-Critic — 基于深度强化学习的多无人机编队协同控制与决策系统。端到端的MASAC算法实现无人机集群的智能编队飞行、目标追踪与动态避障。",
  keywords: [
    "MASAC",
    "多智能体强化学习",
    "无人机协同决策",
    "UAV编队控制",
    "Soft Actor-Critic",
    "深度强化学习",
  ],
  openGraph: {
    title: "MASAC | 多智能体强化学习无人机协同决策系统",
    description: "基于深度强化学习的多无人机编队协同控制与决策系统",
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
