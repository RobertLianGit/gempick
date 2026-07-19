import Link from "next/link";
import { NonOfficialNotice } from "@/src/components/NonOfficialNotice";
import { albums, standaloneTrackCount } from "@/src/data/catalog";

export default function HomePage() {
  const albumTrackCount = albums.reduce((count, album) => count + album.trackIds.length, 0);

  return (
    <>
      <section className="hero page-shell">
        <div className="hero-orbit" aria-hidden="true">
          <span className="hero-planet" />
          <span className="hero-moon" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">你最Pick的G.E.M.邓紫棋歌曲</p>
          <h1>心跳<em>之间</em></h1>
          <p className="hero-lead">找到你最后想留下的那一首，了解每一首歌曲背后的感觉</p>
          <div className="button-row">
            <Link href="/select" prefetch className="button button-primary button-large">开始选择 <span>↗</span></Link>
            <Link href="/about" className="button button-secondary">先看看怎么玩</Link>
          </div>
          <NonOfficialNotice compact />
        </div>
        <div className="hero-index mono" aria-label={`${albums.length} 张发行，${albumTrackCount} 首专辑录音版本，另含 ${standaloneTrackCount} 首精选、影视、公益与合作单曲索引`}>
          <span>{String(albums.length).padStart(2, "0")}<small>张发行</small></span>
          <i />
          <span>{albumTrackCount}<small>首专辑录音版本</small></span>
          <small className="hero-index-note">另含 {standaloneTrackCount} 首单曲索引</small>
        </div>
      </section>

      <section className="page-shell how-it-works">
        <div className="section-heading">
          <p className="eyebrow">沿着轨道前进</p>
          <h2>三步，抵达你的答案</h2>
        </div>
        <div className="steps-grid">
          {[
            ["01", "带上你愿意留下的专辑", "起点十首已经替你准备好；接下来可以按专辑逐首挑选，也可以整张加入。"],
            ["02", "让歌曲开始相遇", "生成一次稳定的相遇顺序；有些歌先见面，有些歌稍后登场。"],
            ["03", "一次次选择，直到留下你最Pick的那首歌", "不熟悉就先去音乐平台听听。你的每次选择都会在本机保存。"],
          ].map(([number, title, copy]) => (
            <article className="step-card" key={number}>
              <span className="step-number mono">{number}</span>
              <div className="mini-orbit" aria-hidden="true"><span /></div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell result-preview-section">
        <div className="result-preview-copy">
          <p className="eyebrow">最后会得到什么？</p>
          <h2>一张属于你的<br />音乐旅程结果。</h2>
          <p>走完整段选择后，你会看到最后留下的那一首、最后一次相遇，以及它沿途经过的每一次选择。这不是哪首歌“最好”，只是这一刻，你最想留下它。</p>
          <Link href="/select" className="text-link text-link-large">开始我的选择 →</Link>
        </div>
        <article className="result-preview-card" aria-label="结果页效果示例">
          <span className="preview-badge">效果示例 · 非真实结果</span>
          <div className="preview-orbit" aria-hidden="true"><span /></div>
          <p className="eyebrow gold-copy">我最 Pick 的 G.E.M. 邓紫棋的歌</p>
          <h3>你的那一首</h3>
          <p className="preview-meta">从 64 首歌曲开始 · 经过 63 次选择</p>
          <div className="preview-route">
            <span>最初相遇</span><i>✦</i><span>最后八首</span><i>✦</i><span>最后留下</span>
          </div>
          <p className="preview-note">“最后留下的，是这一首。”</p>
        </article>
      </section>

      <section className="page-shell promise-section">
        <p>不是寻找“正确答案”，也不是一份公开排名。</p>
        <h2>只是认真听过之后，<br />诚实地做出自己的选择。</h2>
        <Link href="/select" className="text-link text-link-large">进入你的音乐宇宙 →</Link>
      </section>
    </>
  );
}
