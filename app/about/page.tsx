import Link from "next/link";
import { NonOfficialNotice } from "@/src/components/NonOfficialNotice";

export const metadata = { title: "玩法与内容来源" };

export default function AboutPage() {
  return (
    <div className="page-shell prose-page">
      <header className="flow-header"><p className="eyebrow">关于这段旅程</p><h1>不是排名，是一次只属于你的选择。</h1><p>「心跳之间」让熟悉或还不太熟悉的歌曲一次次相遇，直到留下你最 Pick 的那首歌。</p></header>
      <NonOfficialNotice />
      <div className="prose-grid">
        <article><span className="prose-index mono">01</span><h2>怎么开始</h2><p>先从起点十首开始，再按专辑逐首加入，或整张带上。留下 16–128 首后，系统会生成一次固定的相遇顺序。</p></article>
        <article><span className="prose-index mono">02</span><h2>有些歌曲会稍后登场</h2><p>当歌曲数量不能刚好组成完整顺序时，一部分歌曲会先进行预选对决，其余歌曲直接进入下一轮。所有位置都由同一个旅程编号决定。</p></article>
        <article><span className="prose-index mono">03</span><h2>怎么保存</h2><p>选择、相遇顺序和进度只写入当前浏览器的 localStorage。这段选择已经替你保存好了；没有账号，也不上传个人结果。</p></article>
        <article><span className="prose-index mono">04</span><h2>重新认识每一首歌</h2><p>每次相遇都会展示两首歌的作品线索、发行背景和资料来源。不熟悉时可以去音乐平台听听，再回到这里继续选择。</p></article>
      </div>
      <section className="prose-cta"><h2>准备好面对第一组选择了吗？</h2><Link href="/select" className="button button-primary button-large">开始选择 →</Link></section>
    </div>
  );
}
