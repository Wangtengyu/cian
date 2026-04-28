import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "此岸 - 此岸已渡，彼岸未知",
  description: "人生是一场选择，你只能走一条路。你选的路是"此岸"，另一条路是"彼岸"。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-[#0a0a0f]">
        {/* 背景像素点装饰 */}
        <div className="fixed inset-0 opacity-10 pointer-events-none pixel-dots" />
        
        {/* 顶部装饰线 */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e94560] via-[#f39c12] to-[#2ecc71]" />
        
        {children}
        
        {/* 底部装饰 */}
        <footer className="fixed bottom-0 left-0 right-0 py-4 text-center">
          <p className="text-[#4a4a6a] text-sm font-mono">
            此岸已渡 · 彼岸未知
          </p>
        </footer>
      </body>
    </html>
  );
}
