import type { Metadata } from "next";
import { MusicPlatformProvider } from "@/src/components/MusicPlatformProvider";
import { SiteFooter } from "@/src/components/SiteFooter";
import { SiteHeader } from "@/src/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "心跳之间｜邓紫棋歌曲个人 Pick 体验", template: "%s · 心跳之间" },
  description: "一个非官方粉丝项目：让歌曲两两相遇，每次 Pick 一首，得到你的个人排行榜和最 Pick 的歌。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>
        <MusicPlatformProvider>
          <div className="cosmos" aria-hidden="true"><span /><span /><span /></div>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </MusicPlatformProvider>
      </body>
    </html>
  );
}
