import type { Metadata } from "next";
import { MusicPlatformProvider } from "@/src/components/MusicPlatformProvider";
import { SiteFooter } from "@/src/components/SiteFooter";
import { SiteHeader } from "@/src/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "心跳之间｜邓紫棋歌曲个人 Pick 体验", template: "%s · 心跳之间" },
  description: "当 G.E.M. 邓紫棋遇上世界杯：十首种子歌加六个自选席位组成歌曲 16 强，再一路 Pick 到决赛。",
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
