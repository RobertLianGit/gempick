"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BracketView } from "@/src/components/BracketView";
import { starterTrackIds } from "@/src/data/catalog";
import { createBracket, generateSeed, getCurrentMatch, getTournamentShape, PICK_FIELD_SIZE } from "@/src/lib/bracket";
import { useSavedState } from "@/src/hooks/useSavedState";

export default function BracketPage() {
  const router = useRouter();
  const { state, hydrated, updateBracket } = useSavedState();
  const selectedCount = state.selectedTrackIds.length;
  const shape = getTournamentShape(selectedCount);
  const currentStage = state.bracket ? getCurrentMatch(state.bracket)?.roundLabel : undefined;

  function generate() {
    const bracket = createBracket(state.selectedTrackIds, generateSeed());
    updateBracket(bracket);
  }

  if (!hydrated) return <div className="page-shell loading-state">正在读取这次相遇…</div>;
  if (selectedCount !== PICK_FIELD_SIZE) {
    return (
      <div className="page-shell empty-state">
        <span className="empty-orbit" aria-hidden="true" />
        <p className="eyebrow">阵容尚未就位</p>
        <h1>16 强阵容还没有就位</h1>
        <p>预选阶段由 10 首种子歌和你选择的 6 首歌组成。</p>
        <Link href="/select" className="button button-primary">返回预选阶段</Link>
      </div>
    );
  }

  const bracket = state.bracket;
  return (
    <div className="page-shell flow-page bracket-page">
      <header className="flow-header centered-header">
        <p className="eyebrow">第二步 · 世界杯式 Pick 阶段</p>
        <h1>你的歌曲 16 强，准备相遇。</h1>
        <p>{bracket ? "16 强对阵已经保存，刷新不会改变。" : "系统会随机生成 16 强对阵；每次相遇 Pick 一首，一路走到决赛。"}</p>
      </header>

      <section className="draw-panel">
        <div className="draw-orbit" aria-hidden="true"><span /><span /></div>
        <div className="draw-stats">
          <div><strong>{starterTrackIds.length}</strong><span>种子歌</span></div>
          <i />
          <div><strong>{selectedCount - starterTrackIds.length}</strong><span>你的选择</span></div>
          <i />
          <div><strong>{shape.bracketSize}</strong><span>歌曲 16 强</span></div>
          <i />
          <div><strong>{shape.totalMatches}</strong><span>需要 Pick</span></div>
        </div>
        {!bracket ? (
          <button className="button button-primary button-large draw-button" type="button" onClick={generate}>生成 16 强对阵 ✦</button>
        ) : (
          <div className="draw-id mono">本次旅程编号 · GEM-{bracket.seed.toUpperCase()}</div>
        )}
      </section>

      {bracket && (
        <section className="bracket-preview">
          <div className="section-heading inline-heading">
            <div><p className="eyebrow">这次相遇</p><h2>看看它走到了哪里</h2></div>
            <span>{currentStage ? `当前走到：${currentStage}` : "这段旅程已经完成"}</span>
          </div>
          <BracketView bracket={bracket} preview />
          <div className="bracket-actions">
            <Link href="/select" className="button button-secondary">返回调整候选歌</Link>
            <button className="button button-primary button-large" type="button" onClick={() => router.push("/play")}>{bracket.matches.some((match) => match.winnerTrackId) ? "继续 Pick →" : "开始 Pick →"}</button>
          </div>
        </section>
      )}
    </div>
  );
}
