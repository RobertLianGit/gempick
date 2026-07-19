import Link from "next/link";
import { NonOfficialNotice } from "@/src/components/NonOfficialNotice";

export const metadata = { title: "玩法与内容来源" };

export default function AboutPage() {
  return (
    <div className="page-shell prose-page">
      <header className="flow-header"><p className="eyebrow">当 G.E.M. 邓紫棋遇上世界杯</p><h1>从预选阶段，到你的歌曲决赛。</h1><p>这不是公开比赛，而是借用世界杯从入围到决赛的节奏，完成一段只属于你的 Pick 旅程。</p></header>
      <NonOfficialNotice />
      <div className="prose-grid">
        <article><span className="prose-index mono">01</span><h2>预选阶段</h2><p>十首种子歌自动入围，你再从全部作品中选择六首，组成属于自己的歌曲 16 强。</p></article>
        <article><span className="prose-index mono">02</span><h2>Pick 阶段</h2><p>系统随机生成 16 强对阵。每次两首歌相遇，你 Pick 一首进入下一轮，依次经过 8 强、4 强和决赛。</p></article>
        <article><span className="prose-index mono">03</span><h2>怎么保存</h2><p>候选歌、相遇顺序和 Pick 进度只写入当前浏览器的 localStorage。进度会自动保存在本机；没有账号，也不上传个人结果。</p></article>
        <article><span className="prose-index mono">04</span><h2>重新认识每一首歌</h2><p>每次相遇都会展示两首歌的作品线索、发行背景和资料来源。不熟悉时可以去音乐平台听听，再回到这里继续 Pick。</p></article>
      </div>
      <section className="prose-cta"><h2>准备好决定六个自选席位了吗？</h2><Link href="/select" className="button button-primary button-large">进入预选阶段 →</Link></section>
    </div>
  );
}
