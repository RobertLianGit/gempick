"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BracketView } from "@/src/components/BracketView";
import { createBracket, generateSeed, getCurrentMatch, getTournamentShape, MIN_TRACKS } from "@/src/lib/bracket";
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
  if (selectedCount < MIN_TRACKS) {
    return (
      <div className="page-shell empty-state">
        <span className="empty-orbit" aria-hidden="true" />
        <p className="eyebrow">阵容尚未就位</p>
        <h1>还需要 {MIN_TRACKS - selectedCount} 首歌</h1>
        <p>至少加入 16 首候选歌，才能让歌曲开始相遇。</p>
        <Link href="/select" className="button button-primary">继续加入候选歌</Link>
      </div>
    );
  }

  const bracket = state.bracket;
  return (
    <div className="page-shell flow-page bracket-page">
      <header className="flow-header centered-header">
        <p className="eyebrow">第二步 · 生成 Pick 顺序</p>
        <h1>让歌曲开始相遇</h1>
        <p>{bracket ? "这次相遇已经替你保存好了，刷新不会改变结果。" : "有些歌曲会先遇见，有些歌曲会稍后登场。位置完全随机，也不回避同专辑相遇。"}</p>
      </header>

      <section className="draw-panel">
        <div className="draw-orbit" aria-hidden="true"><span /><span /></div>
        <div className="draw-stats">
          <div><strong>{selectedCount}</strong><span>候选歌曲</span></div>
          <i />
          <div><strong>{shape.qualifierCount}</strong><span>预选 Pick</span></div>
          <i />
          <div><strong>{shape.bracketSize}</strong><span>随后登场</span></div>
          <i />
          <div><strong>{shape.totalMatches}</strong><span>需要 Pick</span></div>
        </div>
        {shape.qualifierCount > 0 && <p className="draw-note">有些歌曲会稍后登场，直接进入下一轮。</p>}
        {!bracket ? (
          <button className="button button-primary button-large draw-button" type="button" onClick={generate}>生成这次相遇 ✦</button>
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
