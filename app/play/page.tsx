"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/src/components/ProgressBar";
import { MusicListenButton } from "@/src/components/MusicPlatformProvider";
import { TrackCard } from "@/src/components/TrackCard";
import { getTrack } from "@/src/data/catalog";
import {
  decideMatch,
  getCompletedMatchCount,
  getCurrentMatch,
  getMatchParticipants,
  undoLastDecision,
} from "@/src/lib/bracket";
import { useSavedState } from "@/src/hooks/useSavedState";

type Reveal = { winnerId: string; loserId: string; roundLabel: string };

export default function PlayPage() {
  const router = useRouter();
  const { state, hydrated, updateBracket } = useSavedState();
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const bracket = state.bracket;
  const currentMatch = bracket ? getCurrentMatch(bracket) : undefined;
  const participants = useMemo(() => currentMatch && bracket ? getMatchParticipants(currentMatch, bracket) : undefined, [currentMatch, bracket]);
  const leftTrack = participants?.[0] ? getTrack(participants[0]) : undefined;
  const rightTrack = participants?.[1] ? getTrack(participants[1]) : undefined;

  useEffect(() => {
    if (hydrated && bracket && !currentMatch && !reveal) router.replace("/result");
  }, [hydrated, bracket, currentMatch, reveal, router]);

  const choose = useCallback((winnerId: string) => {
    if (!bracket || !currentMatch || !participants || reveal) return;
    const loserId = participants.find((id) => id !== winnerId);
    if (!loserId) return;
    updateBracket(decideMatch(bracket, currentMatch.id, winnerId));
    setReveal({ winnerId, loserId, roundLabel: currentMatch.roundLabel });
  }, [bracket, currentMatch, participants, reveal, updateBracket]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (reveal) return;
      if (event.key === "ArrowLeft" && leftTrack) choose(leftTrack.id);
      if (event.key === "ArrowRight" && rightTrack) choose(rightTrack.id);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [choose, leftTrack, reveal, rightTrack]);

  if (!hydrated) return <div className="page-shell loading-state">正在继续刚才的 Pick…</div>;
  if (!bracket) {
    return (
      <div className="page-shell empty-state">
        <span className="empty-orbit" aria-hidden="true" />
        <h1>歌曲还没有开始相遇</h1>
        <p>先加入想参与的候选歌，再生成这次相遇。</p>
        <button className="button button-primary" onClick={() => router.push("/select")}>从加入候选歌开始</button>
      </div>
    );
  }

  if (reveal) {
    const winner = getTrack(reveal.winnerId);
    const loser = getTrack(reveal.loserId);
    const complete = getCompletedMatchCount(bracket);
    const finished = complete === bracket.matches.length;
    return (
      <div className="page-shell reveal-page">
        <div className="reveal-orbit" aria-hidden="true"><span /></div>
        <p className="eyebrow">{reveal.roundLabel} · 这次 Pick 已保存在本机</p>
        <h1>{winner?.title}</h1>
        <p className="reveal-line">{finished ? "你完成了最后一次 Pick。" : "你 Pick 了这一首，它将进入下一轮。"}</p>
        <div className="reveal-fact">
          <span>歌曲背后的感觉</span>
          <p>{winner?.summary}</p>
          <small>{winner?.albumTitle} · {winner?.releaseYear}{winner?.language.length ? ` · ${winner.language.join(" / ")}` : ""}</small>
          {winner?.albumIntroduction && <p className="reveal-album-context">发行背景：{winner.albumIntroduction}</p>}
        </div>
        {winner && <MusicListenButton track={winner} className="listen-button reveal-listen-button" title="去听这首歌" note="使用你选择的音乐平台 ↗" />}
        <div className="reveal-actions">
          <button className="button button-secondary" type="button" onClick={() => {
            updateBracket(undoLastDecision(bracket));
            setReveal(null);
          }}>撤回刚才的 Pick</button>
          <button className="button button-primary button-large" type="button" onClick={() => finished ? router.push("/result") : setReveal(null)}>
            {finished ? "查看我的最 Pick ✦" : "继续 Pick →"}
          </button>
        </div>
        <p className="reveal-loser">《{loser?.title}》这一次没有被 Pick</p>
      </div>
    );
  }

  if (!currentMatch || !leftTrack || !rightTrack) return <div className="page-shell loading-state">正在抵达最终结果…</div>;

  const completed = getCompletedMatchCount(bracket);
  const sameRound = bracket.matches.filter((match) => match.roundLabel === currentMatch.roundLabel);
  const roundPosition = sameRound.findIndex((match) => match.id === currentMatch.id) + 1;
  return (
    <div className="page-shell play-page">
      <ProgressBar current={completed} total={bracket.matches.length} label={`${currentMatch.roundLabel}｜第 ${roundPosition} 次相遇`} />
      <header className="duel-heading">
        <p className="eyebrow">很难，但还是要 Pick 一首</p>
        <h1>这一轮，你 Pick 哪一首？</h1>
      </header>
      <aside className="duel-listen-guide">
        <span aria-hidden="true">♪</span>
        <p><strong>有不太熟悉的歌？先去听听，再回来 Pick。</strong><small>每张卡片都可以前往音乐平台；打开外链不会丢失这里的进度。</small></p>
      </aside>
      <div className="duel-stage">
        <TrackCard track={leftTrack} side="left" onChoose={() => choose(leftTrack.id)} />
        <div className="versus" aria-hidden="true"><span>VS</span></div>
        <TrackCard track={rightTrack} side="right" onChoose={() => choose(rightTrack.id)} />
      </div>
      <div className="play-controls">
        <button className="text-button" type="button" disabled={completed === 0} onClick={() => updateBracket(undoLastDecision(bracket))}>← 上一步</button>
        <p><kbd>←</kbd><kbd>→</kbd> 也可以快速 Pick</p>
        <button className="text-button" type="button" onClick={() => router.push("/bracket")}>暂停并看看完整旅程</button>
      </div>
    </div>
  );
}
