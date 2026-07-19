import Link from "next/link";
import { MusicPlatformSettings } from "@/src/components/MusicPlatformProvider";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>非官方粉丝项目｜与艺人本人及相关团队不存在隶属或授权关系</p>
      <div>
        <MusicPlatformSettings />
        <Link href="/about">玩法与来源</Link>
        <Link href="/legal">隐私与权利说明</Link>
      </div>
    </footer>
  );
}
