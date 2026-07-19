"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { albumsById, starterTrackIds, tracks } from "@/src/data/catalog";
import { PICK_FIELD_SIZE } from "@/src/lib/bracket";
import { useSavedState } from "@/src/hooks/useSavedState";

const starterTrackIdSet = new Set(starterTrackIds);
const selfPickSlotCount = PICK_FIELD_SIZE - starterTrackIds.length;

export default function WildcardsPage() {
  const router = useRouter();
  const { state, hydrated, updateSelection, reset } = useSavedState();
  const [query, setQuery] = useState("");
  const selected = state.selectedTrackIds;
  const selectedSelfPickCount = selected.filter((id) => !starterTrackIdSet.has(id)).length;
  const starterSongsReady = starterTrackIds.every((id) => selected.includes(id));
  const fieldIsReady = starterSongsReady && selected.length === PICK_FIELD_SIZE;
  const legacySelectionNeedsRestart = state.starterSeeded && !state.bracket && (!starterSongsReady || selectedSelfPickCount > selfPickSlotCount);
  const candidates = useMemo(() => tracks.filter((track) => {
    const text = `${track.title} ${track.albumTitle}`.toLowerCase();
    return text.includes(query.toLowerCase());
  }), [query]);

  function toggle(trackId: string) {
    if (starterTrackIdSet.has(trackId)) return;
    if (selected.includes(trackId)) {
      updateSelection(selected.filter((id) => id !== trackId));
    } else if (selectedSelfPickCount < selfPickSlotCount && selected.length < PICK_FIELD_SIZE) {
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
        <p className="eyebrow">预选阶段 · 六个自选席位</p>
        <h1>{fieldIsReady ? "歌曲 16 强已经就位" : "你的六个席位，Pick 哪几首？"}</h1>
        <p>{fieldIsReady ? "现在可以生成 16 强对阵，进入正式 Pick 阶段。" : `十首种子歌已经自动入围；还需要选择 ${Math.max(0, selfPickSlotCount - selectedSelfPickCount)} 首。`}</p>
      </header>
      <section className="top-action-panel wildcard-action-panel">
        <div className="top-action-status">
          <span className="status-star" aria-hidden="true">✦</span>
          <div>
            <strong>{legacySelectionNeedsRestart ? "需要按新赛制重新预选" : `自选席位 ${selectedSelfPickCount} / ${selfPickSlotCount}`}</strong>
            <span>{legacySelectionNeedsRestart ? "新的阵容固定为 10 首种子歌 + 6 个自选席位" : fieldIsReady ? "16 强已经就位 · 接下来完成 15 次 Pick" : `还差 ${Math.max(0, selfPickSlotCount - selectedSelfPickCount)} 个席位`}</span>
            <small>候选歌和 Pick 进度已保存在本机</small>
          </div>
        </div>
        <div className="top-action-buttons">
          <button className="text-link reset-selection-button" type="button" onClick={restartSelection}>重新开始 Pick</button>
          <button className="button button-primary button-large" type="button" disabled={!fieldIsReady} onClick={() => router.push("/bracket")}>
            {legacySelectionNeedsRestart ? "请先重新开始" : fieldIsReady ? "进入 Pick 阶段 →" : `还差 ${Math.max(0, selfPickSlotCount - selectedSelfPickCount)} 个席位`}
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
          const seeded = starterTrackIdSet.has(track.id);
          return (
            <button
              className={`track-tile ${checked ? "track-tile-selected" : ""}`}
              type="button"
              onClick={() => toggle(track.id)}
              disabled={seeded}
              aria-pressed={checked}
              aria-label={seeded ? `种子歌《${track.title}》已自动入围` : `${checked ? "移除" : "加入"}《${track.title}》`}
              key={track.id}
            >
              <span className="track-tile-check">{checked ? "✦" : "+"}</span>
              <strong title={track.title}>{track.title}</strong>
              <small title={albumsById.get(track.albumId)?.title ?? track.albumTitle}>{albumsById.get(track.albumId)?.title ?? track.albumTitle} · {track.releaseYear}</small>
              <em>{seeded ? "种子歌 · 已入围" : checked ? "移出席位" : "加入自选席位"}</em>
            </button>
          );
        })}
      </div>
    </div>
  );
}
