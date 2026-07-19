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
          <p className="eyebrow">当 G.E.M. 邓紫棋遇上世界杯</p>
          <h1>心跳<em>之间</em></h1>
          <p className="hero-lead">先进入预选阶段：十首种子歌自动入围，另外六个席位由你决定。组成歌曲 16 强后进入 Pick 阶段，每次两首相遇、Pick 一首，一路走到决赛。</p>
          <div className="button-row">
            <a href="./select/" className="button button-primary button-large">开始我的 Pick <span>↗</span></a>
            <a href="./about/" className="button button-secondary">先看看怎么玩</a>
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
          <h2>从预选，到你的决赛。</h2>
        </div>
        <div className="steps-grid">
          {[
            ["01", "预选阶段：十首种子歌", "十首代表作自动入围，不占你的自选席位。"],
            ["02", "你来决定另外六首", "从全部作品里 Pick 六首，和种子歌一起组成歌曲 16 强。"],
            ["03", "Pick 阶段：一路到决赛", "16 强两两相遇，每次 Pick 一首；完成 15 次 Pick，得到个人排行榜和最 Pick 的歌。"],
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
          <h2>一份属于你的<br />个人歌曲排行榜。</h2>
          <p>你的 16 强会从八组相遇开始，经过 8 强、4 强和决赛。完成全部 15 次 Pick 后，不只会得到最 Pick 的歌，还会看到完整个人排行榜和每一次 Pick。</p>
          <a href="./select/" className="text-link text-link-large">开始我的 Pick →</a>
        </div>
        <article className="result-preview-card" aria-label="结果页效果示例">
          <span className="preview-badge">效果示例 · 非真实结果</span>
          <div className="preview-orbit" aria-hidden="true"><span /></div>
          <p className="eyebrow gold-copy">我最 Pick 的 G.E.M. 邓紫棋的歌</p>
          <h3>你的那一首</h3>
          <p className="preview-meta">从歌曲 16 强开始 · 完成 15 次 Pick</p>
          <div className="preview-route">
            <span>16 强</span><i>✦</i><span>8 强</span><i>✦</i><span>决赛 Pick</span>
          </div>
          <p className="preview-note">“最终 Pick 的，是这一首。”</p>
        </article>
      </section>

      <section className="page-shell promise-section">
        <p>不是寻找“正确答案”，也不是一份公开排名。</p>
        <h2>只是认真听过之后，<br />诚实地完成每一次 Pick。</h2>
        <a href="./select/" className="text-link text-link-large">开始我的 Pick →</a>
      </section>
    </>
  );
}
