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
          <p className="eyebrow">你最 Pick 的 G.E.M. 邓紫棋歌曲</p>
          <h1>心跳<em>之间</em></h1>
          <p className="hero-lead">先把想参与的歌加入候选，再让它们两两相遇。每次面对两首歌，Pick 更喜欢的那首；一轮轮 Pick 下去，直到得到你的个人排行榜和最 Pick 的歌。沿途也会了解每首歌背后的故事。</p>
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
          <h2>三步，完成你的 Pick</h2>
        </div>
        <div className="steps-grid">
          {[
            ["01", "加入想参与的歌", "起点十首已经替你准备好；接下来可以按专辑逐首加入，也可以整张加入候选。"],
            ["02", "每次相遇，Pick 一首", "每次面对两首歌，Pick 这一刻更喜欢的那首；有些歌先见面，有些歌稍后登场。"],
            ["03", "一轮轮 Pick 到最后", "完成所有 Pick 后，你会得到个人排行榜和最 Pick 的歌。不熟悉就先去音乐平台听听，每次 Pick 都会在本机保存。"],
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
          <p>你会从一组候选歌开始，让它们逐对相遇，每次 Pick 一首。完成全部 Pick 后，不只会得到最 Pick 的歌，还会看到覆盖所有候选歌的个人排行榜和完整 Pick 过程。</p>
          <a href="./select/" className="text-link text-link-large">开始我的 Pick →</a>
        </div>
        <article className="result-preview-card" aria-label="结果页效果示例">
          <span className="preview-badge">效果示例 · 非真实结果</span>
          <div className="preview-orbit" aria-hidden="true"><span /></div>
          <p className="eyebrow gold-copy">我最 Pick 的 G.E.M. 邓紫棋的歌</p>
          <h3>你的那一首</h3>
          <p className="preview-meta">从 64 首候选歌开始 · 完成 63 次 Pick</p>
          <div className="preview-route">
            <span>最初相遇</span><i>✦</i><span>最后八首</span><i>✦</i><span>最终 Pick</span>
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
