"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { albumsById, tracks } from "@/src/data/catalog";
import { MAX_TRACKS, MIN_TRACKS } from "@/src/lib/bracket";
import { useSavedState } from "@/src/hooks/useSavedState";

export default function WildcardsPage() {
  const router = useRouter();
  const { state, hydrated, updateSelection, reset } = useSavedState();
  const [query, setQuery] = useState("");
  const selected = state.selectedTrackIds;
  const candidates = useMemo(() => tracks.filter((track) => {
    const text = `${track.title} ${track.albumTitle}`.toLowerCase();
    return text.includes(query.toLowerCase());
  }), [query]);

  function toggle(trackId: string) {
    if (selected.includes(trackId)) {
      updateSelection(selected.filter((id) => id !== trackId));
    } else if (selected.length < MAX_TRACKS) {
      updateSelection([...selected, trackId]);
    }
  }

  function restartSelection() {
    if (window.confirm("重新开始后，之前的 Pick 记录会被清除。确定要从头来吗？")) {
      reset();
      router.push("/select");
    }
  }

  if (!hydrated) return <div className="page-shell loading-state">正在整理候选歌曲…</div>;

  return (
    <div className="page-shell flow-page">
      <header className="flow-header compact-header">
        <p className="eyebrow">逐首加入候选</p>
        <h1>{selected.length < MIN_TRACKS ? "还想加入哪几首？" : "候选歌都在这里了吗？"}</h1>
        <p>{selected.length < MIN_TRACKS ? `目前有 ${selected.length} 首候选歌，还需要加入 ${MIN_TRACKS - selected.length} 首，才能开始 Pick。` : "确认候选歌后就可以开始相遇；不同语言、现场或重录版本会作为不同录音版本出现。"}</p>
      </header>
      <section className="top-action-panel wildcard-action-panel">
        <div className="top-action-status">
          <span className="status-star" aria-hidden="true">✦</span>
          <div>
            <strong>已加入 {selected.length} 首候选歌</strong>
            <span>{selected.length < MIN_TRACKS ? `还差 ${MIN_TRACKS - selected.length} 首，才能开始 Pick` : `接下来将完成 ${selected.length - 1} 次 Pick`}</span>
            <small>候选歌和 Pick 进度已保存在本机</small>
          </div>
        </div>
        <div className="top-action-buttons">
          <button className="text-link reset-selection-button" type="button" onClick={restartSelection}>重新开始 Pick</button>
          <button className="button button-primary button-large" type="button" disabled={selected.length < MIN_TRACKS} onClick={() => router.push("/bracket")}>
            {selected.length < MIN_TRACKS ? `还差 ${MIN_TRACKS - selected.length} 首` : "开始相遇 →"}
          </button>
        </div>
      </section>

      <div className="reference-heading">
        <div><p className="eyebrow">候选歌曲参考</p><h2>加入候选，或者移出候选</h2></div>
        <span>{candidates.length} 首</span>
      </div>
      <label className="search-field">
        <span className="sr-only">搜索歌曲或专辑</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索歌曲或专辑…" />
        <span aria-hidden="true">⌕</span>
      </label>
      <div className="wildcard-matrix">
        {candidates.map((track) => {
          const checked = selected.includes(track.id);
          return (
            <button
              className={`track-tile ${checked ? "track-tile-selected" : ""}`}
              type="button"
              onClick={() => toggle(track.id)}
              aria-pressed={checked}
              aria-label={`${checked ? "移除" : "加入"}《${track.title}》`}
              key={track.id}
            >
              <span className="track-tile-check">{checked ? "✦" : "+"}</span>
              <strong title={track.title}>{track.title}</strong>
              <small title={albumsById.get(track.albumId)?.title ?? track.albumTitle}>{albumsById.get(track.albumId)?.title ?? track.albumTitle} · {track.releaseYear}</small>
              <em>{checked ? "移出候选" : "加入候选"}</em>
            </button>
          );
        })}
      </div>
    </div>
  );
}
