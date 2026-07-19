"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BracketView } from "@/src/components/BracketView";
import { MusicListenButton } from "@/src/components/MusicPlatformProvider";
import { NonOfficialNotice } from "@/src/components/NonOfficialNotice";
import { getTrack } from "@/src/data/catalog";
import { getChampionRoute, getChampionTrackId, getMatchParticipants, getRankingTiers } from "@/src/lib/bracket";
import { createResultImage } from "@/src/lib/result-image";
import { useSavedState } from "@/src/hooks/useSavedState";

export default function ResultPage() {
  const router = useRouter();
  const { state, hydrated, reset } = useSavedState();
  const [showBracket, setShowBracket] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string>();
  const [imageState, setImageState] = useState("生成结果图片");
  const bracket = state.bracket;
  const championId = bracket ? getChampionTrackId(bracket) : undefined;
  const champion = championId ? getTrack(championId) : undefined;
  const route = useMemo(() => bracket && championId ? getChampionRoute(bracket, championId) : [], [bracket, championId]);
  const rankingTiers = useMemo(() => bracket ? getRankingTiers(bracket) : [], [bracket]);
  const finalMatch = bracket?.matches.at(-1);
  const finalistId = finalMatch && bracket && championId
    ? getMatchParticipants(finalMatch, bracket).find((id) => id !== championId)
    : undefined;
  const finalist = finalistId ? getTrack(finalistId) : undefined;

  useEffect(() => () => {
    if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
  }, [resultImageUrl]);

  async function generateShareImage() {
    if (!champion || !bracket) return;
    setImageState("正在生成…");
    try {
      const blob = await createResultImage({
        title: champion.title,
        titleEn: champion.titleEn,
        albumTitle: champion.albumTitle,
        releaseYear: champion.releaseYear,
        selectedCount: bracket.selectedTrackIds.length,
        choiceCount: bracket.matches.length,
        routeCount: route.length,
      });
      setResultImageUrl(URL.createObjectURL(blob));
      setImageState("生成结果图片");
    } catch {
      setImageState("生成失败，请再试一次");
    }
  }

  if (!hydrated) return <div className="page-shell loading-state">正在点亮最后一颗星…</div>;
  if (!bracket || !champion) {
    return (
      <div className="page-shell empty-state">
        <span className="empty-orbit" aria-hidden="true" />
        <h1>你的最 Pick 还没有出现</h1>
        <p>完成全部 Pick 后，你会在这里看到结果和完整过程。</p>
        <button className="button button-primary" onClick={() => router.push(bracket ? "/play" : "/select")}>{bracket ? "继续刚才的 Pick" : "开始我的 Pick"}</button>
      </div>
    );
  }

  return (
    <div className="result-page">
      <section className="page-shell champion-hero">
        <div className="champion-orbit" aria-hidden="true"><span /><span /><span /></div>
        <p className="eyebrow gold-copy">我最 Pick 的 G.E.M. 邓紫棋的歌</p>
        <h1>{champion.title}</h1>
        {champion.titleEn && <p className="champion-en">{champion.titleEn}</p>}
        <p className="champion-meta">{champion.albumTitle} · {champion.releaseYear}</p>
        <p className="champion-statement">最终 Pick 的，是这一首。</p>
        <p className="champion-explanation">这不是哪首歌“最好”，只是这一刻，它最对你的心跳。</p>
        <div className="champion-actions">
          <MusicListenButton track={champion} className="button button-gold button-large result-listen-button" title="去听这首歌" note="" />
          <button className="button button-primary button-large" type="button" onClick={generateShareImage} disabled={imageState === "正在生成…"}>{imageState}</button>
          <button className="button button-secondary" type="button" onClick={() => setShowBracket(!showBracket)}>{showBracket ? "收起完整旅程" : "看看完整旅程"}</button>
        </div>
        <NonOfficialNotice compact />
      </section>

      <section className="page-shell result-details">
        <div className="result-stats">
          <div><strong>{bracket.selectedTrackIds.length} 首</strong><span>候选歌曲</span></div>
          <div><strong>{bracket.matches.length} 次</strong><span>完成 Pick</span></div>
          <div><strong>{route.length} 次</strong><span>被 Pick 次数</span></div>
          <div><strong>{finalist?.title ?? "—"}</strong><span>最后一次遇见</span></div>
        </div>
        <section className="ranking-section">
          <div className="ranking-heading">
            <div><p className="eyebrow">只属于你的结果</p><h2>我的邓紫棋歌曲个人排行榜</h2></div>
            <p>按照每首歌在这次旅程中走到的阶段分层；同一层并列，不制造你没有做过的比较。</p>
          </div>
          <div className="ranking-list">
            {rankingTiers.map((tier) => {
              const rankLabel = tier.startRank === tier.endRank ? `第 ${tier.startRank} 名` : `第 ${tier.startRank}–${tier.endRank} 名`;
              const content = (
                <div className="ranking-tracks">
                  {tier.trackIds.map((trackId) => {
                    const track = getTrack(trackId);
                    return track ? (
                      <article className={`ranking-track ${tier.startRank === 1 ? "ranking-track-first" : ""}`} key={trackId}>
                        <span aria-hidden="true">{tier.startRank === 1 ? "✦" : "○"}</span>
                        <div><strong>{track.title}</strong><small>{track.albumTitle} · {track.releaseYear}</small></div>
                      </article>
                    ) : null;
                  })}
                </div>
              );

              if (tier.endRank <= 8) {
                return (
                  <article className="ranking-tier ranking-tier-open" key={`${tier.startRank}-${tier.endRank}`}>
                    <div className="ranking-tier-title"><strong>{rankLabel}</strong><span>{tier.stageLabel}{tier.trackIds.length > 1 ? ` · ${tier.trackIds.length} 首并列` : ""}</span></div>
                    {content}
                  </article>
                );
              }

              return (
                <details className="ranking-tier" key={`${tier.startRank}-${tier.endRank}`}>
                  <summary className="ranking-tier-title"><strong>{rankLabel}</strong><span>{tier.stageLabel} · {tier.trackIds.length} 首并列</span></summary>
                  {content}
                </details>
              );
            })}
          </div>
        </section>
        <div className="route-section">
          <div className="section-heading"><p className="eyebrow">星光连线</p><h2>它走过的路</h2></div>
          <div className="route-list">
            {route.map(({ match, opponentTrackId }, index) => (
              <article className="route-item" key={match.id}>
                <span className="route-star">✦</span>
                <div><small>{match.roundLabel}</small><p>Pick《{champion.title}》</p><span>这一次遇见《{opponentTrackId ? getTrack(opponentTrackId)?.title : "未知"}》</span></div>
                <em className="mono">{String(index + 1).padStart(2, "0")}</em>
              </article>
            ))}
          </div>
        </div>
        {showBracket && <div className="full-bracket"><BracketView bracket={bracket} /></div>}
        <div className="restart-panel">
          <div><p className="eyebrow">下一次也许会不同</p><h2>Pick 没有标准答案。</h2><p>重新开始后，之前的 Pick 记录会被清除。</p></div>
          <button className="button button-secondary" type="button" onClick={() => {
            if (window.confirm("重新开始后，之前的 Pick 记录会被清除。确定要从头来吗？")) {
              reset();
              router.push("/select");
            }
          }}>重新开始 Pick</button>
        </div>
      </section>
      {resultImageUrl && (
        <div className="result-share-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setResultImageUrl(undefined);
        }}>
          <section className="result-share-dialog" role="dialog" aria-modal="true" aria-labelledby="result-share-title">
            <div className="result-share-heading">
              <div><p className="eyebrow">结果图片已经生成</p><h2 id="result-share-title">把这一刻保存下来</h2></div>
              <button className="dialog-close" type="button" aria-label="关闭结果图片" onClick={() => setResultImageUrl(undefined)}>×</button>
            </div>
            <div className="result-share-image">
              <Image src={resultImageUrl} width={1600} height={1200} unoptimized alt={`《${champion.title}》结果分享图片`} />
            </div>
            <div className="result-share-actions">
              <p>在手机上也可以长按图片保存。</p>
              <a className="button button-gold" href={resultImageUrl} download={`心跳之间-${champion.title}.png`} target="_blank" rel="noreferrer">保存图片</a>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
